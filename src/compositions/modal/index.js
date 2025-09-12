import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useBottomPromptStore } from '@/store/bottom-prompt'
import { useModalStore } from '@/store/modal'
import { usePaymentStore } from '@/store/payment'
import { usePopupMessageStore } from '@/store/popup-message'
import { useRouters } from '@use/routers'
import { CONSUME_TYPE, MODAL_TYPE } from '@const/index'
import uploadImage from '@/http/upload/uploadImage'

export function useDialog() {
  const { t: $t } = useI18n()
  const { open, close, alert: $alert } = useModalStore()
  const { toCreator, toFeed } = useRouters()

  const accountStore = useAccountStore()
  const { userData, isLogin } = storeToRefs(accountStore)

  const { open: openMessage } = usePopupMessageStore()
  const { open: openPaymentDialog } = usePaymentStore()
  const { showPrompt } = useBottomPromptStore()

  async function uploadImageDialog(file, callback = null) {
    try {
      const progress = ref(0)
      open(MODAL_TYPE.PROGRESS, {
        size: 'sm',
        title: '上傳中',
        content: {
          progress: progress.value,
        },
        showClose: false,
        showConfirm: false,
      })
      const result = await uploadImage(file, (p) => (progress.value = p * 100))
      callback && callback(result)
      return result
    } catch (e) {
      console.error(e)
    } finally {
      close()
    }
  }

  function failed(reason) {
    $alert({
      size: 'sm',
      title: 'modal.payFailed.title',
      content: $t('modal.payFailed.content', { reason }),
      confirmText: $t('common.confirm'),
    })
  }

  async function subscribe({ item, creator }) {
    console.log('subscribe 函数被调用', { item, creator, isLogin: isLogin.value })

    if (!item) {
      console.log('订阅项不存在')
      openMessage('message.error.subscriptionNotFound')
      close()
      return
    }

    // 只有登录用户才检查是否订阅自己
    if (isLogin.value && userData.value.aff === creator.aff) {
      console.log('用户尝试订阅自己的内容')
      openMessage('message.error.subscribeSelf')
      close()
      return
    }
    open(MODAL_TYPE.SUBSCRIBE, {
      size: 'sm',
      imageTitle: item.picture,
      content: item,
      confirmText: $t('modal.subscribe.confirm', { price: item.price }),
      confirmAction: () => { },
      showClose: true,
      gradientConfirm: true,
      canEscape: true,
      nextAction: () =>
        openPaymentDialog({
          amount: item.price,
          paymentConfig: {
            apiKey: 'Payment.sub',
            data: { item_id: item.id, aff: creator.aff, amount: item.price },
            paymentType: CONSUME_TYPE.SUBSCRIBE,
            onSuccess: () => {
              console.log('支付成功，调用 subscribeSuccess', creator)
              // 此处将订阅记录在LocalStorage，避免重复弹窗
              // 1. 不用登入即可完成 單片或訂閱 購買＆觀看。
              // 2. 若不註冊，僅在同一瀏覽器可觀看（換瀏覽器/裝置不可看）。
              const key = `nologin_subscriptions`
              if (localStorage.getItem(key)) {
                const data = JSON.parse(localStorage.getItem(key))
                const items = data.items.filter((i) => i.id !== item.id)
                // 如果已订阅则不重复添加
                if (!items.find((i) => i.id === item.id)) {
                  items.push({ ...item, timestamp: Date.now() })
                }
              }

              subscribeSuccess(creator)
            },
            onFailure: failed,
            onCancel: () => { },
            onTimeout: () => { },
          },
        }),
    })
  }

  function setNoLoginSubscriptionToUser(creator) {
    if (!isLogin.value) return
    const key = `nologin_subscriptions`
    if (localStorage.getItem(key)) {
      const data = JSON.parse(localStorage.getItem(key))
      const items = data.items
        .filter((i) => i.timestamp && Date.now() - i.timestamp < 7 * 24 * 60 * 60 * 1000) // 仅保留7天内的记录
        .map((i) => ({ item_id: i.id, aff: creator.aff, amount: i.price }))
      if (items.length === 0) return
      accountStore.setNoLoginSubscriptions(items)
      localStorage.removeItem(key) // 清除记录，避免重复提交
    }
  }

  function shopBuy(feed) {
    // 只有登录用户才检查是否购买自己的产品
    if (isLogin.value && userData.value.aff === feed.user.aff) {
      openMessage($t('message.error.shopBuySelf'))
      close()
      return
    }

    open(MODAL_TYPE.SHOP_BUY, {
      size: 'sm',
      avatarTitle: feed.user.thumb,
      content: feed,
      confirmText: $t('modal.shopBuy.confirm', { price: feed.price }),
      confirmAction: () => { },
      showClose: true,
      gradientConfirm: true,
      nextAction: () =>
        openPaymentDialog({
          amount: feed.price,
          paymentConfig: {
            apiKey: 'Payment.buy',
            data: { item_id: feed.id, aff: feed.user.aff, amount: feed.price },
            paymentType: CONSUME_TYPE.SHOP_BUY,
            onSuccess: () => {
              console.log('支付成功，调用 shopBuySuccess', feed)
              shopBuySuccess(feed)
            },
            onFailure: failed,
            onCancel: () => { },
            onTimeout: () => { },
          },
        }),
    })
  }

  function subscribeSuccess(creator) {
    // 所有用户都使用带头像的弹窗
    open(MODAL_TYPE.SUBSCRIBE_SUCCESS_WITH_AVATAR, {
      size: 'sm',
      title: null,
      content: creator,
      confirmText: $t('modal.subscribeSuc.confirm'),
      confirmAction: () => {
        if (!isLogin.value) {
          // 未登录用户：点击"前往查看"后显示底部注册提示条
          showPrompt({
            message: '尽快点击前往注册或登录，避免购买资料遗失',
            autoHide: false,
            paymentParams: {
              type: 'subscribe',
              creator: creator,
              timestamp: Date.now(),
            },
          })
        }
        toCreator(creator.username)
        close() // 关闭弹窗
      },
      cancelText: $t('modal.subscribeSuc.cancel'),
      cancelAction: () => {
        if (!isLogin.value) {
          // 未登录用户：点击"先再逛逛"后显示底部注册提示条
          showPrompt({
            message: '尽快点击前往注册或登录，避免购买资料遗失',
            autoHide: false,
            paymentParams: {
              type: 'subscribe',
              creator: creator,
              timestamp: Date.now(),
            },
          })
        }
        close() // 关闭弹窗
      },
      showClose: true,
    })
  }

  function shopBuySuccess(feed) {
    if (!isLogin.value) {
      // 未登录用户：显示成功弹窗，点击确认后显示底部注册提示条
      open(MODAL_TYPE.SHOP_BUY_SUCCESS, {
        size: 'sm',
        title: 'modal.title.paySuc',
        content: {},
        confirmText: $t('modal.shopBuySuc.confirm'),
        confirmAction: () => {
          // 点击确认后显示底部注册提示条
          showPrompt({
            message: '尽快点击前往注册或登录，避免购买资料遗失',
            autoHide: false,
            paymentParams: {
              type: 'shop_buy',
              feed: feed,
              timestamp: Date.now(),
            },
          })
          toFeed(feed.user.username, feed.id)
        },
        showClose: true,
      })
    } else {
      // 已登录用户显示成功弹窗
      open(MODAL_TYPE.SHOP_BUY_SUCCESS, {
        size: 'sm',
        title: 'modal.title.paySuc',
        content: {},
        confirmText: $t('modal.shopBuySuc.confirm'),
        confirmAction: () => toFeed(feed.user.username, feed.id),
        showClose: true,
      })
    }
  }

  // 测试函数：手动显示底部提示栏
  function testBottomPrompt() {
    showPrompt({
      message: '尽快点击前往注册或登录，避免购买资料遗失',
      autoHide: false,
    })
  }

  return {
    uploadImageDialog,
    subscribe, // 移除 afterLoginAction 包装，允许未登录用户订阅
    shopBuy, // 移除 afterLoginAction 包装，允许未登录用户购买
    subscribeSuccess,
    shopBuySuccess,
    testBottomPrompt, // 测试函数
  }
}
