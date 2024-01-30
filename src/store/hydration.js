import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHydrationStore = defineStore('hydration', () => {
  // route devmode/hydration
  const devTest = ref(null)

  // 前置資料
  const appConfig = ref(null)
  const categories = ref(null)
  const userData = ref(null)

  // route home
  const forYou = ref(null)

  // route search

  // route creator
  const creator = ref(null)
  const creatorError = ref('')

  // route feed

  const prodData = {
    appConfig,
    categories,
    userData,

    forYou,

    creator,
    creatorError,
  }

  return import.meta.env.DEV ? { devTest, ...prodData } : prodData
})
