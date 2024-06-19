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

  const close = async () => {
    isActivated.value = false
    const html = document.getElementsByTagName('html')[0]
    if (html.style.overflow) html.style.overflow = ''
  }

  const open = async (props) => {
    console.log('open', props)
    if (isActivated.value) return

    _setupActiveDefault()

    mediaContainer.value = props
    isActivated.value = true

    const html = document.getElementsByTagName('html')[0]
    html.style.overflow = 'hidden'
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
    mediaContainer,
    handleBackDrop,
  }
})
