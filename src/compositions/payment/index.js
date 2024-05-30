import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFeedStore } from '@/store/feed'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
// import { notifyBuy, notifyCampaign, notifySub } from '@/utils/state-broadcast'
import { toQueryString } from '@/utils/string-helper'
import useRequest from '@/compositions/request'
import { CONSUME_TYPE } from '@/constant'
// import { trackEvent } from '@/gtm'
import API from '@/http'

// import { $t } from '@/i18n'

// import { sendDonateMessage } from '@/ws'

export function usePayment() {
  const { open } = usePopupMessageStore()
  const { close } = useModalStore()
  const { $t } = useI18n()

  const frequency = 5000 // 5 秒輪詢一次

  // 開發環境 12 秒，正式環境 5 分鐘
  const timeout = import.meta.env.DEV ? 12 * 1000 : 5 * 60 * 1000
  let tick = 0

  const isContinue = ref(false)
  let window

  const actions = reactive({
    onSuccess: null,
    onFailure: null,
    onCancel: null,
    onTimeout: null,
  })

  const setupAction = ({ onSuccess, onFailure, onCancel, onTimeout }) => {
    actions.onSuccess = onSuccess
    actions.onFailure = onFailure
    actions.onCancel = onCancel
    actions.onTimeout = onTimeout
  }

  /**
   * 支付程序
   * @param {String} apiKey apiKey
   * @param {Object} data Payload
   * @param {String} paymentType 打賞: 1, 訂閱: 5, 購買項目: 10
   */
  async function pay({
    apiKey,
    data,
    paymentType,
    newWindow,
    userUUID = null,
    amount,
    onSuccess = null,
    onFailure = null,
    onCancel = null,
    onTimeout = null,
  } = {}) {
    try {
      window = newWindow
      setupAction({ onSuccess, onFailure, onCancel, onTimeout })

      const response = await useRequest(apiKey, { params: data, immediate: true })
      console.log('create payment response:', response)
      if (!response.order_id || !response.url) {
        throw new Error('Order number or payment callback url is missing')
      }

      window.location = response.post_data
        ? `/payment.html?${toQueryString({ ...response.post_data, POST_URL: encodeURIComponent(response.url) })}`
        : response.url

      // const key = getGtmKey(paymentType)
      // const meta = getMeta(paymentType, data)
      // const gtmData = { value: amount, meta }
      // trackEvent({ key, ...gtmData })

      isContinue.value = true
      fetchPollingResult({
        apiKey: 'Payment.check',
        orderId: response.order_id,
        payload: data,
        paymentType,
        userUUID,
        // gtmData,
      })
    } catch (e) {
      console.error('[Payment Error]', e)
      setTimeout(
        onFailed(e.message, () => actions.onFailure && actions.onFailure(e.message)),
        1500,
      )
    }
  }

  // TODO 等待後端 API
  async function payStripe() {}

  /**
   * 輪詢支付結果
   * @param {Function} apiKey
   * @param {String} orderId 訂單編號
   */
  const fetchPollingResult = async ({ apiKey, orderId, payload, paymentType, userUUID, gtmData = null } = {}) => {
    console.log('[fetchPollingResult] isContinue.value', isContinue.value)
    if (!isContinue.value) {
      console.log('[fetchPollingResult] Continue is false, stop polling')
      isContinue.value = true
      return
    }
    console.log('[fetchPollingResult] Continue is true, polling...')
    try {
      if (tick >= timeout) {
        setTimeout(
          onFailed('payment procedure time out.', () => actions.onTimeout && actions.onTimeout()),
          1500,
        )
        return
      }
      const response = await useRequest(apiKey, { params: { order_id: orderId }, immediate: true })
      console.log('[fetchPollingResult] Polling Result', response)
      console.log('[fetchPollingResult] MODE', import.meta.env.MODE)

      if (response.success) {
        close()
        open($t('message.payment.success'))
        actions.onSuccess && actions.onSuccess()

        // trackEvent({ key: 47, ...gtmData })

        const { unlockFeed, unlockSubscribe } = useFeedStore()

        switch (paymentType) {
          case CONSUME_TYPE.SUBSCRIBE:
            console.log('解鎖訂閱, 訂閱方案:', payload.item_id)
            await unlockSubscribe(payload.item_id)
            break
          case CONSUME_TYPE.SHOP_BUY:
            console.log('解鎖單篇帖子', payload.item_id)
            await unlockFeed(payload.item_id)
            break
          default:
            throw new Error('Payment Type Error')
        }
      } else {
        console.log('[fetchPollingResult] Polling Pending...')
        setTimeout(() => {
          fetchPollingResult({
            apiKey,
            orderId,
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
      console.error('[fetchPollingResult] Polling Failed...', e)
      isContinue.value = false
      setTimeout(
        onFailed(e.message, () => actions.onFailure && actions.onFailure(e.message)),
        1500,
      )
    }
  }

  function onFailed(errMessage, fn = null) {
    window.close()
    close()
    fn && fn()
    open(`${$t('message.payment.failed')}: ${errMessage}`)
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
    if (!isContinue.value) {
      console.warn('哭啊，支付輪詢根本沒啟動是在取消什麼啊')
      throw new Error('Payment is not in progress, should not cancel')
    }

    isContinue.value = false
    if (window) window.close()
    open($t('message.payment.cancel'))
    actions.onCancel && actions.onCancel()
  }

  return { pay, cancel }
}
