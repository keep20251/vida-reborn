import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MODAL_TYPE } from '@const'

export const useModalStore = defineStore('modal', () => {
  const type = ref(null)
  const size = ref('lg')
  const title = ref(null)
  const content = ref(null)
  const confirmAction = ref(null)
  const confirmText = ref(null)
  const cancelAction = ref(null)
  const cancelText = ref(null)
  const otherAction = ref(null)
  const otherText = ref(null)
  const showClose = ref(false)

  const confirmData = ref(null)

  const isOpen = computed(() => type.value !== null)

  function alert({ size = 'sm', title, content, confirmAction = () => {}, confirmText } = {}, showClose = false) {
    open(MODAL_TYPE.ALERT, { size, title, content, confirmAction, confirmText, showClose })
  }

  function confirm({
    size = 'lg',
    title,
    content,
    confirmAction,
    confirmText,
    cancelAction = () => {},
    cancelText,
    otherAction = () => {},
    otherText,
    showClose = false,
  } = {}) {
    open(MODAL_TYPE.CONFIRM, {
      size,
      title,
      content,
      confirmAction,
      confirmText,
      cancelAction,
      cancelText,
      otherAction,
      otherText,
      showClose,
    })
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
    otherAction.value = options.otherAction
    otherText.value = options.otherText
    showClose.value = options.showClose
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
    otherAction.value = null
    otherText.value = null
    confirmData.value = null
    showClose.value = false
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
    otherAction,
    otherText,
    confirmData,

    isOpen,
    showClose,

    alert,
    confirm,
    open,
    close,
    setConfirmData,
  }
})
