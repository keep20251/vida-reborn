import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
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
  const { afterLoginAction } = accountStore
  const { userData } = storeToRefs(accountStore)

  const { open: openMessage } = usePopupMessageStore()
  const { open: openPaymentDialog } = usePaymentStore()

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
    if (!item) {
      openMessage('message.error.subscriptionNotFound')
      close()
      return
    }

    if (userData.value.aff === creator.aff) {
      openMessage('message.error.subscribeSelf')
      close()
      return
    }

    open(MODAL_TYPE.SUBSCRIBE, {
      size: 'sm',
      imageTitle: item.picture,
      content: item,
      confirmText: $t('modal.subscribe.confirm', { price: item.price }),
      confirmAction: () => {},
      showClose: true,
      gradientConfirm: true,
      nextAction: () =>
        openPaymentDialog({
          amount: item.price,
          paymentConfig: {
            apiKey: 'Payment.sub',
            data: { item_id: item.id, aff: creator.aff, amount: item.price },
            paymentType: CONSUME_TYPE.SUBSCRIBE,
            onSuccess: () => {
              subscribeSuccess(creator)
            },
            onFailure: failed,
            onCancel: () => console.log('取消付款啦'),
            onTimeout: () => console.log('付款逾時啦'),
          },
        }),
    })
  }

  function shopBuy(feed) {
    if (userData.value.aff === feed.user.aff) {
      openMessage($t('message.error.shopBuySelf'))
      close()
      return
    }

    open(MODAL_TYPE.SHOP_BUY, {
      size: 'sm',
      avatarTitle: feed.user.thumb,
      content: feed,
      confirmText: $t('modal.shopBuy.confirm', { price: feed.price }),
      confirmAction: () => {},
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
              shopBuySuccess(feed)
            },
            onFailure: failed,
            onCancel: () => console.log('取消付款啦'),
            onTimeout: () => console.log('付款逾時啦'),
          },
        }),
    })
  }

  function subscribeSuccess(creator) {
    open(MODAL_TYPE.SUBSCRIBE_SUCCESS, {
      size: 'sm',
      title: 'modal.title.paySuc',
      content: creator,
      confirmText: $t('modal.subscribeSuc.confirm'),
      confirmAction: () => toCreator(creator.username),
      showClose: true,
    })
  }

  function shopBuySuccess(feed) {
    open(MODAL_TYPE.SHOP_BUY_SUCCESS, {
      size: 'sm',
      title: 'modal.title.paySuc',
      content: {},
      confirmText: $t('modal.shopBuySuc.confirm'),
      confirmAction: () => toFeed(feed.user.username, feed.id),
      showClose: true,
    })
  }

  return {
    uploadImageDialog,

    subscribe: afterLoginAction(subscribe),
    shopBuy: afterLoginAction(shopBuy),
    subscribeSuccess,
    shopBuySuccess,
  }
}
