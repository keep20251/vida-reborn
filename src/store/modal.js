import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MODAL_TYPE } from '@/constant'

export const useModalStore = defineStore('modal', () => {
  const type = ref(null)
  const size = ref('lg')
  const title = ref(null)
  const content = ref(null)
  const confirmAction = ref(null)
  const confirmText = ref(null)
  const cancelAction = ref(null)
  const cancelText = ref(null)

  const confirmData = ref(null)

  const isOpen = computed(() => type.value !== null)

  function alert({ size = 'sm', title, content, confirmAction = () => {}, confirmText } = {}) {
    open(MODAL_TYPE.ALERT, { size, title, content, confirmAction, confirmText })
  }

  function confirm({
    size = 'lg',
    title,
    content,
    confirmAction,
    confirmText,
    cancelAction = () => {},
    cancelText,
  } = {}) {
    open(MODAL_TYPE.CONFIRM, { size, title, content, confirmAction, confirmText, cancelAction, cancelText })
  }

  function open(t, options) {
    type.value = t
    size.value = options.size || 'lg'
    title.value = options.title
    content.value = options.content
    confirmAction.value = options.confirmAction
    confirmText.value = options.confirmText
    cancelAction.value = options.cancelAction
    cancelText.value = options.cancelText
  }

  function close() {
    type.value = null
    size.value = 'lg'
    title.value = null
    content.value = null
    confirmAction.value = null
    confirmText.value = null
    cancelAction.value = null
    cancelText.value = null
    confirmData.value = null
  }

  function setConfirmData(action) {
    confirmData.value = action
  }

  return {
    type,
    size,
    title,
    content,
    confirmAction,
    confirmText,
    cancelAction,
    cancelText,
    confirmData,

    isOpen,

    alert,
    confirm,
    open,
    close,
    setConfirmData,
  }
})
