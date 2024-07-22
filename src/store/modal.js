import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { MODAL_TYPE } from '@const'

export const useModalStore = defineStore('modal', () => {
  const type = ref(null)
  const size = ref('lg')
  const title = ref(null)
  const imageTitle = ref(null)
  const avatarTitle = ref(null)
  const content = ref(null)

  const titleClass = ref('')
  const contentClass = ref('')

  const confirmAction = ref(null)
  const confirmText = ref(null)
  const cancelAction = ref(null)
  const cancelText = ref(null)

  const otherAction = ref(null)
  const otherText = ref(null)

  const showClose = ref(false)
  const showConfirm = ref(true)

  // 漸層色的確認按鈕
  const gradientConfirm = ref(false)

  const confirmData = ref(null)

  // 接著 Close 之後要執行的動作
  const nextAction = ref(null)

  const isOpen = computed(() => type.value !== null)

  function alert({
    size = 'sm',
    title,
    content,
    titleClass = '',
    contentClass = '',
    confirmAction = () => {},
    confirmText,
    showClose = false,
    showConfirm = true,
  } = {}) {
    open(MODAL_TYPE.ALERT, {
      size,
      title,
      content,
      titleClass,
      contentClass,
      confirmAction,
      confirmText,
      showClose,
      showConfirm,
    })
  }

  function confirm({
    size = 'lg',
    title,
    content,
    titleClass = '',
    contentClass = '',
    confirmAction,
    confirmText,
    cancelAction = () => {},
    cancelText,
    otherAction,
    otherText,
    showClose = false,
    showConfirm = true,
  } = {}) {
    open(MODAL_TYPE.CONFIRM, {
      size,
      title,
      content,
      titleClass,
      contentClass,
      confirmAction,
      confirmText,
      cancelAction,
      cancelText,
      otherAction,
      otherText,
      showClose,
      showConfirm,
    })
  }

  function open(t, options) {
    type.value = t
    size.value = options.size || 'lg'
    title.value = options.title || null
    imageTitle.value = options.imageTitle || null
    avatarTitle.value = options.avatarTitle || null
    content.value = options.content
    titleClass.value = options.titleClass || ''
    contentClass.value = options.contentClass || ''
    confirmAction.value = options.confirmAction
    confirmText.value = options.confirmText
    cancelAction.value = options.cancelAction
    cancelText.value = options.cancelText
    otherAction.value = options.otherAction
    otherText.value = options.otherText
    showClose.value = options.showClose
    showConfirm.value = options.showConfirm || true
    gradientConfirm.value = options.gradientConfirm || false
    nextAction.value = options.nextAction || null
  }

  function close() {
    type.value = null
    size.value = 'lg'
    title.value = null
    imageTitle.value = null
    avatarTitle.value = null
    content.value = null
    titleClass.value = ''
    contentClass.value = ''
    confirmAction.value = null
    confirmText.value = null
    cancelAction.value = null
    cancelText.value = null
    otherAction.value = null
    otherText.value = null
    confirmData.value = null
    showClose.value = false
    showConfirm.value = true
    gradientConfirm.value = false
  }

  function setConfirmData(action) {
    confirmData.value = action
  }

  return {
    type,
    size,
    title,
    imageTitle,
    avatarTitle,
    content,

    titleClass,
    contentClass,

    confirmAction,
    confirmText,
    cancelAction,
    cancelText,

    otherAction,
    otherText,

    confirmData,

    isOpen,
    showClose,
    showConfirm,

    gradientConfirm,
    nextAction,

    alert,
    confirm,
    open,
    close,
    setConfirmData,
  }
})
