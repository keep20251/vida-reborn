import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import { usePayment } from '@use/payment'
import { useRouters } from '@use/routers'
import { CONSUME_TYPE, MODAL_TYPE } from '@const'
import uploadImage from '@/http/upload/uploadImage'

export function useDialog() {
  const { t: $t } = useI18n()
  const { pay, cancel } = usePayment()
  const { open, close } = useModalStore()
  const { toCreator, toFeed } = useRouters()

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

  function paying() {
    open(MODAL_TYPE.PAYING, {
      title: 'modal.paying.title',
      size: 'sm',
      confirmText: $t('common.cancel'),
      confirmAction: () => cancel(),
    })
  }

  async function subscribe({ item, creator }) {
    open(MODAL_TYPE.SUBSCRIBE, {
      size: 'sm',
      imageTitle: item.picture,
      content: item,
      confirmText: $t('modal.subscribe.confirm', { price: item.price }),
      confirmAction: async (data) => {
        await pay({
          apiKey: 'Payment.sub',
          data: { item_id: item.id },
          newWindow: data.window,
          paymentType: CONSUME_TYPE.SUBSCRIBE,
          amount: 0,
          onSuccess: () => () => {
            subscribeSuccess(creator)
          },
          onFailure: () => console.log('付款失敗啦'),
          onCancel: () => console.log('取消付款啦'),
        })
      },
      showClose: true,
      gradientConfirm: true,
      nextAction: paying,
    })
  }

  function shopBuy(feed) {
    open(MODAL_TYPE.SHOP_BUY, {
      size: 'sm',
      avatarTitle: feed.user.thumb,
      content: feed,
      confirmText: $t('modal.shopBuy.confirm', { price: feed.price }),
      confirmAction: async (data) => {
        await pay({
          apiKey: 'Payment.buy',
          data: { item_id: feed.id },
          newWindow: data.window,
          paymentType: CONSUME_TYPE.SHOP_BUY,
          amount: 0,
          onSuccess: () => {
            shopBuySuccess(feed)
          },
          onFailure: () => console.log('付款失敗啦'),
          onCancel: () => console.log('取消付款啦'),
        })
      },
      showClose: true,
      gradientConfirm: true,
      nextAction: paying,
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

    paying,
    subscribe,
    shopBuy,
    subscribeSuccess,
    shopBuySuccess,
  }
}
