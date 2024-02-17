import { reactive, ref } from 'vue'
import { useModalStore } from '@/store/modal'
// import { notifyBuy, notifyCampaign, notifySub } from '@/utils/state-broadcast'
import { toQueryString } from '@/utils/string-helper'
import useRequest from '@/compositions/request'
import { CONSUME_TYPE } from '@/constant'
// import { trackEvent } from '@/gtm'
import API from '@/http'

// import { $t } from '@/i18n'

// import { sendDonateMessage } from '@/ws'

export function usePayment() {
  const { close } = useModalStore()

  const frequency = 5000 // 5 秒輪詢一次
  const timeout = 1000 * 60 * 5 // 5 分鐘
  let tick = 0

  const isContinue = ref(true)
  let window

  const actions = reactive({
    onSuccess: null,
    onFailure: null,
    onCancel: null,
  })

  /**
   * 支付程序
   * @param {String} api apiKey
   * @param {Object} data Payload
   * @param {String} paymentType 打賞: 1, 訂閱: 5, 購買項目: 10
   */
  async function pay({
    api,
    data,
    paymentType,
    newWindow,
    userUUID = null,
    amount,
    onSuccess = null,
    onFailure = null,
    onCancel = null,
  } = {}) {
    try {
      window = newWindow
      actions.onSuccess = onSuccess
      actions.onFailure = onFailure
      actions.onCancel = onCancel

      const response = await useRequest(api, { params: data, immediate: true })
      console.log('create payment response:', response)
      if (!response.order_no || !response.pay_url) {
        throw new Error('Order number or payment callback url is missing')
      }

      window.location = response.post_data
        ? `/payment.html?${toQueryString({ ...response.post_data, POST_URL: encodeURIComponent(response.pay_url) })}`
        : response.pay_url

      // const key = getGtmKey(paymentType)
      // const meta = getMeta(paymentType, data)
      // const gtmData = { value: amount, meta }
      // trackEvent({ key, ...gtmData })

      // TODO 後端的輪詢API還沒好，暫時先註解掉
      // isContinue.value = true
      // fetchPollingResult({
      //   api: getPollingAPI(paymentType),
      //   orderNo: response.order_no,
      //   payload: data,
      //   paymentType,
      //   userUUID,
      //   // gtmData,
      // })
    } catch (e) {
      console.error('[Payment Error]', e)
      setTimeout(() => {
        window.close()
        close()
        console.error(e)
      }, 1500)
    }
  }

  /**
   * 輪詢支付結果
   * @param {Function} api
   * @param {String} orderNo 訂單編號
   */
  const fetchPollingResult = async ({ api, orderNo, payload, paymentType, userUUID, gtmData = null } = {}) => {
    console.log('[fetchPollingResult] isContinue.value', isContinue.value)
    if (!isContinue.value) {
      console.log('[fetchPollingResult] Continue is false, stop polling')
      isContinue.value = true
      return
    }
    console.log('[fetchPollingResult] Continue is true, polling...')
    try {
      if (tick >= timeout) {
        setTimeout(() => {
          close()
          // trackEvent({ key: 48, ...gtmData })
        }, 1500)
        return
      }
      const response = await api({ data: { order_no: orderNo } })
      console.log('[fetchPollingResult] Polling Result', response)
      console.log('[fetchPollingResult] MODE', import.meta.env.MODE)

      if (response.success) {
        close()
        actions.onSuccess && actions.onSuccess()
        // trackEvent({ key: 47, ...gtmData })

        // TODO 暫時先註解掉，還沒走到同步資料的階段
        // 廣播通知
        // switch (paymentType) {
        //   case CONSUME_TYPE.REWARD:
        //     sendDonateMessage(
        //       payload.message ?? import.meta.env.VITE_DONATE_DEFAULT_MESSAGE,
        //       userUUID,
        //       payload.aff,
        //       payload.amount,
        //     )
        //     break
        //   case CONSUME_TYPE.SUBSCRIBE:
        //     notifySub(payload.author_aff)
        //     break
        //   case CONSUME_TYPE.SHOP_BUY:
        //     notifyBuy(payload.id)
        //     break
        //   case CONSUME_TYPE.UNLOCK:
        //     notifyCampaign()
        //     break
        //   default:
        //     throw new Error('Payment Type Error')
        // }
      } else {
        console.log('[fetchPollingResult] Polling Pending...')
        setTimeout(() => {
          fetchPollingResult({
            api,
            orderNo,
            payload,
            paymentType,
            userUUID,
            gtmData,
          })
          tick += frequency
        }, frequency)
      }
    } catch (e) {
      // trackEvent({ key: 48, ...gtmData })
      actions.onFailure && actions.onFailure()
      console.error('[fetchPollingResult] Polling Failed...', e)
      isContinue.value = false
      setTimeout(() => {
        window.close()
        close()
        console.error(e)
      }, 1500)
    }
  }

  /**
   * 根據支付類型取得輪詢 API
   * @param {String} paymentType
   * @returns
   */
  const getPollingAPI = (paymentType) => {
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
    actions.onCancel && actions.onCancel()
  }

  return { pay, cancel }
}
