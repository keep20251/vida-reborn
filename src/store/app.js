import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import { isMobile as checkMobile } from '@/utils/device'

const DESKTOP = 'desktop'
const MOBILE = 'mobile'

export const useAppStore = defineStore('app', () => {
  // RWD 設定
  const device = ref(checkMobile() ? MOBILE : DESKTOP)
  const isDesktop = computed(() => device.value === DESKTOP)
  const isMobile = computed(() => device.value === MOBILE)
  useEventListener('resize', () => {
    setTimeout(() => (device.value = checkMobile() ? MOBILE : DESKTOP), 0)
  })

  return {
    isDesktop,
    isMobile,
  }
})
