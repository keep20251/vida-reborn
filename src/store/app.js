import { computed, reactive, readonly, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import useRequest from '@use/request'
import { isMobile as checkMobile } from '@/utils/device'
import { getAppConfig, getCategories } from '@/utils/server-config-cache'

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
    const appConfig = await getAppConfig(
      async () => await useRequest('App.config', { params: { version: '1.0' }, immediate: true }),
    )
    setAppConfig(appConfig)
    return appConfig
  }
  function setAppConfig(data) {
    if (!data) {
      return
    }
    for (const [k, v] of Object.entries(data)) {
      appConfig[k] = v
    }
  }

  const allPayments = ref([])
  async function syncAllPaymentConfig() {
    const response = await useRequest('Payment.getAllPayment', { immediate: true })
    allPayments.value = response.map((item) => ({ ...item, pay_type_ids: item.pay_type_ids.split(',').map(Number) }))
  }

  const categories = ref([])
  async function initCategories() {
    const categories = await getCategories(async () => {
      const data = await useRequest('Article.categories', { immediate: true })
      return Object.keys(data.list).map((k) => ({ label: `category.${k}`, value: k }))
    })
    setCategories(categories)
    return categories
  }
  function setCategories(data) {
    categories.value = [...data]
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

    allPayments: readonly(allPayments),
    syncAllPaymentConfig,
  }
})
