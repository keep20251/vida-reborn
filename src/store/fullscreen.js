import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useFullscreenStore = defineStore('fullscreen', () => {
  const isActivated = ref(false)
  const backdrop = ref(true)
  const showCloseBtn = ref(true)
  const mediaType = ref('image') // image, video, audio, for extension
  const mediaList = ref([])
  const mediaCurrentIndex = ref(0)

  const mediaContainer = ref({})

  const setupProps = async (props) => {
    const ins = useFullscreenStore
    for (const key in props) {
      if (ins[key]) ins[key] = props[key]
    }
  }

  const close = async () => {
    isActivated.value = false
  }

  const open = async (props) => {
    console.log('open', props)
    if (isActivated.value) return

    _setupActiveDefault()

    mediaContainer.value = props
    console.log('mediaContainer', mediaContainer.value)
    isActivated.value = true
  }

  const handleBackDrop = () => {
    if (backdrop.value && isActivated.value) close()
  }

  const _setupActiveDefault = () => {
    const { isDesktop } = useAppStore()
    if (isDesktop) {
      backdrop.value = true
      showCloseBtn.value = true
    } else {
      backdrop.value = false
      showCloseBtn.value = true
    }
  }

  return {
    isActivated,
    mediaType,
    mediaList,
    mediaCurrentIndex,
    backdrop,
    showCloseBtn,
    close,
    open,
    setupProps,
    mediaContainer,
    handleBackDrop,
  }
})
