import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBottomPromptStore = defineStore('bottom-prompt', () => {
  // 从localStorage恢复状态
  const getStoredState = () => {
    try {
      const stored = localStorage.getItem('bottom-prompt-state')
      return stored ? JSON.parse(stored) : { show: false, message: '', autoHideDelay: 0 }
    } catch {
      return { show: false, message: '', autoHideDelay: 0 }
    }
  }

  const storedState = getStoredState()
  const show = ref(storedState.show)
  const message = ref(storedState.message)
  const autoHideDelay = ref(storedState.autoHideDelay)
  const paymentParams = ref(storedState.paymentParams || null) // 支付成功参数

  // 保存状态到localStorage
  const saveState = () => {
    try {
      localStorage.setItem(
        'bottom-prompt-state',
        JSON.stringify({
          show: show.value,
          message: message.value,
          autoHideDelay: autoHideDelay.value,
          paymentParams: paymentParams.value,
        }),
      )
    } catch (error) {
      console.warn('Failed to save bottom prompt state:', error)
    }
  }

  function showPrompt(options = {}) {
    const {
      message: msg = '尽快点击前往注册或登录，避免购买资料遗失',
      autoHide = false,
      delay = 10000, // 10秒后自动隐藏
      paymentParams: params = null, // 支付成功参数
    } = options

    message.value = msg
    show.value = true
    autoHideDelay.value = autoHide ? delay : 0
    paymentParams.value = params // 保存支付参数

    // 保存状态到localStorage
    saveState()

    // 如果设置了自动隐藏，则启动定时器
    if (autoHide && delay > 0) {
      setTimeout(() => {
        hidePrompt()
      }, delay)
    }
  }

  function hidePrompt() {
    show.value = false
    message.value = ''
    autoHideDelay.value = 0
    paymentParams.value = null // 清除支付参数

    // 保存状态到localStorage
    saveState()
  }

  // 获取支付参数（用于登录时携带）
  function getPaymentParams() {
    return paymentParams.value
  }

  // 清除支付参数（登录成功后调用）
  function clearPaymentParams() {
    paymentParams.value = null
    saveState()
  }

  return {
    show,
    message,
    autoHideDelay,
    paymentParams,
    showPrompt,
    hidePrompt,
    getPaymentParams,
    clearPaymentParams,
  }
})
