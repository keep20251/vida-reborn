import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBottomPromptStore = defineStore('bottom-prompt', () => {
  const show = ref(false)
  const message = ref('')
  const autoHideDelay = ref(0) // 0 表示不自动隐藏

  function showPrompt(options = {}) {
    const { 
      message: msg = '尽快点击前往注册或登录，避免购买资料遗失',
      autoHide = false,
      delay = 10000 // 10秒后自动隐藏
    } = options

    message.value = msg
    show.value = true
    autoHideDelay.value = autoHide ? delay : 0

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
  }

  return {
    show,
    message,
    autoHideDelay,
    showPrompt,
    hidePrompt
  }
})
