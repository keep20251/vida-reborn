import { readonly, ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { defineStore } from 'pinia'

export const usePopupMessageStore = defineStore('popupMessage', () => {
  const isOpen = ref(false)
  const message = ref('')
  const failedTheme = ref(false)

  const {
    isPending,
    start: startCloseTimer,
    stop: stopCloseTimer,
  } = useTimeoutFn(
    () => {
      isOpen.value = false
    },
    3000,
    { immediate: false },
  )

  function open(text, isfailed = false) {
    if (!isPending.value) {
      stopCloseTimer()
      isOpen.value = false
      message.value = ''
    }

    isOpen.value = true
    message.value = text
    failedTheme.value = isfailed
    startCloseTimer()
  }

  return {
    isOpen: readonly(isOpen),
    message: readonly(message),
    failedTheme: readonly(failedTheme),
    open,
  }
})
