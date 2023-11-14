import { $t } from '@/i18n'
import { usePopupMessageStore } from '@/store/popup-message'
import { usePopupDialogStore } from '@/store/popup-dialog'
import { CONSUME_TYPE } from '@/constant'
import { notifySub, notifyBuy, notifyCampaign } from '@/utils/state-broadcast'
import { sendDonateMessage } from '@/ws'
import { trackEvent } from '@/gtm'
import API from '@/http'
import { ref } from 'vue'

export function usePayment() {
  const { open } = usePopupMessageStore()
  const { close } = usePopupDialogStore()

  const frequency = 5000 // 5 秒輪詢一次
  const timeout = 1000 * 60 * 5 // 5 分鐘
  let tick = 0

  const isContinue = ref(true)
  let window

  /**
   * 支付程序
   * @param {Function} api
   * @param {Object} data Payload
   * @param {String} paymentType 打賞: 1, 訂閱: 5, 購買項目: 10
   */
  async function pay(api, data, paymentType, newWindow, userUUID, amount, callback = null) {
    try {
      window = newWindow
      const response = await api({ data })
      console.log('create payment response:', response)
      if (response.order_no && response.pay_url) {
        window.location = response.pay_url
        const key = getGtmKey(paymentType)
        const meta = getMeta(paymentType, data)
        const gtmData = { value: amount, meta }
        trackEvent({ key, ...gtmData })
        fetchPollingResult(
          getPollingAPI(paymentType),
          response.order_no,
          data,
          paymentType,
          userUUID,
          gtmData,
          callback,
        )
      } else {
        throw new Error('Order number or payment callback url is missing')
      }
    } catch (e) {
      console.error('[Payment Error]', e)
      setTimeout(() => {
        window.close()
        close()
        open($t('label.paymentFailed') + e)
      }, 1500)
    }
  }

  /**
   * 輪詢支付結果
   * @param {Function} api
   * @param {String} orderNo 訂單編號
   */
  const fetchPollingResult = async (api, orderNo, payload, paymentType, userUUID, gtmData, callback = null) => {
    if (!isContinue.value) {
      console.log('Continue is false, stop polling')
      isContinue.value = true
      return
    }
    console.log('Continue is true, polling...')
    try {
      if (tick >= timeout) {
        setTimeout(() => {
          close()
          open($t('payment.failed'))
          trackEvent({ key: 48, ...gtmData })
        }, 1500)
        return
      }
      const response = await api({ data: { order_no: orderNo } })
      console.log('Polling Result', response)

      if (response.success || import.meta.env.DEV) {
        close()
        open($t('payment.success'))
        trackEvent({ key: 47, ...gtmData })

        if (callback) callback()

        // 廣播通知
        switch (paymentType) {
          case CONSUME_TYPE.REWARD:
            sendDonateMessage(payload.message, userUUID, payload.aff, payload.amount)
            break
          case CONSUME_TYPE.SUBSCRIBE:
            notifySub(payload.author_aff)
            break
          case CONSUME_TYPE.SHOP_BUY:
            notifyBuy(payload.id)
            break
          case CONSUME_TYPE.UNLOCK:
            notifyCampaign()
            break
          default:
            throw new Error('Payment Type Error')
        }
      } else {
        console.log('Polling Pending...')
        setTimeout(() => {
          fetchPollingResult(api, orderNo)
          tick += frequency
        }, frequency)
      }

      // TODO 丁滿說不會有付款失敗的可能，失敗邏輯先放著。鏡花水月情，玲瓏剔透心，看盡乾坤浮雲眾，輝映藍色水玲瓏，讓我們繼續看下去
      // case PAYMENT_STATUS.FAILED:
      // open($t('payment.failed'))
      // trackEvent({ key: 48, ...gtmData })
    } catch (e) {
      trackEvent({ key: 48, ...gtmData })
      console.error('Polling Failed...', e)
    }
  }

  /**
   * 根據支付類型取得輪詢 API
   * @param {String} paymentType
   * @returns
   */
  const getPollingAPI = (paymentType) => {
    console.log('paymentType', paymentType)
    switch (paymentType) {
      case CONSUME_TYPE.REWARD:
        return API.Home.rewardCheck
      case CONSUME_TYPE.SUBSCRIBE:
        return API.Home.checkSubscribePay
      case CONSUME_TYPE.SHOP_BUY:
        return API.Home.shopCheckBuy
      case CONSUME_TYPE.UNLOCK:
        return API.Home.unlockCheckBuy
      default:
        throw new Error('Payment Type Error')
    }
  }

  const getGtmKey = (paymentType) => {
    switch (paymentType) {
      case CONSUME_TYPE.REWARD:
        return 46
      case CONSUME_TYPE.SUBSCRIBE:
        return 44
      case CONSUME_TYPE.SHOP_BUY:
        return 45
      case CONSUME_TYPE.UNLOCK:
        return 50
      default:
        throw new Error('Payment Type Error')
    }
  }

  const getMeta = (paymentType, payload) => {
    switch (paymentType) {
      case CONSUME_TYPE.REWARD:
        return { aff: payload.aff }
      case CONSUME_TYPE.SUBSCRIBE:
        return { aff: payload.author_aff }
      case CONSUME_TYPE.SHOP_BUY:
        return { id: payload.id }
      case CONSUME_TYPE.UNLOCK:
        return {}
      default:
        throw new Error('Payment Type Error')
    }
  }

  const cancel = () => {
    isContinue.value = false
    if (window) window.close()
    open($t('payment.cancel'))
  }

  return { pay, cancel }
}
