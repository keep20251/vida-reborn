import { computed, reactive, readonly, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import useRequest from '@use/request'
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

  // 後端提供的全域參數
  const appConfig = reactive({})
  async function initAppConfig() {
    const data = await useRequest('App.config', { params: { version: '1.0' }, immediate: true })
    setAppConfig(data)
    return data
  }
  function setAppConfig(data) {
    if (!data) {
      return
    }
    for (const [k, v] of Object.entries(data)) {
      appConfig[k] = v
    }
  }

  const categories = ref([])
  async function initCategories() {
    const data = await useRequest('Article.categories', { immediate: true })
    setCategories(data.list)
    return data.list
  }
  function setCategories(data) {
    Object.entries(data).forEach(([value, label]) => {
      categories.value.push({ label, value })
    })
  }

  return {
    isDesktop,
    isMobile,

    appConfig: readonly(appConfig),
    initAppConfig,
    setAppConfig,

    categories: readonly(categories),
    initCategories,
    setCategories,
  }
})
