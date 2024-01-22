import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHydrationStore = defineStore('hydration', () => {
  // route devmode/hydration
  const devTest = ref(null)

  // 前置資料
  const userData = ref(null)

  // route home

  // route search

  // route creator
  const creator = ref(null)
  const creatorError = ref('')

  // route feed

  const prodData = {
    userData,

    creator,
    creatorError,
  }

  return import.meta.env.DEV ? { devTest, ...prodData } : prodData
})
