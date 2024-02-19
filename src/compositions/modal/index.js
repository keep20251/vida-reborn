import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import { usePayment } from '@use/payment'
import { CONSUME_TYPE, MODAL_TYPE } from '@const'
import uploadImage from '@/http/upload/uploadImage'

export function useDialog() {
  const { t: $t } = useI18n()
  const { pay, cancel } = usePayment()
  const { open, close } = useModalStore()

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

  async function subscribe(item) {
    open(MODAL_TYPE.SUBSCRIBE, {
      size: 'sm',
      imageTitle: item.picture,
      content: item,
      confirmText: $t('common.subscribe'),
      confirmAction: async (data) => {
        await pay({
          api: 'Payment.sub',
          data: { item_id: item.id },
          newWindow: data.window,
          paymentType: CONSUME_TYPE.SUBSCRIBE,
          amount: 0,
        })
      },
      showClose: true,
      gradientConfirm: true,
      nextAction: paying,
    })
  }

  function shopBuy() {
    console.log('購買還沒做好喔嘻嘻')
  }

  return {
    uploadImageDialog,

    paying,
    subscribe,
    shopBuy,
  }
}
