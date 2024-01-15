import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useEventListener } from '@vueuse/core'
import { isMobile as checkMobile } from '@/utils/device'

const DESKTOP = 'desktop'
const MOBILE = 'mobile'

export const useAppStore = defineStore('app', () => {
  // RWD 設定
  const device = ref(null)
  const isDesktop = computed(() => device.value === DESKTOP)
  const isMobile = computed(() => device.value === MOBILE)
  const checkDevice = () => {
    device.value = checkMobile() ? MOBILE : DESKTOP
  }
  useEventListener('resize', checkDevice)
  checkDevice()

  return {
    isDesktop,
    isMobile,
  }
})
