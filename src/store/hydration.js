import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHydrationStore = defineStore('hydration', () => {
  // route devmode/hydration
  const devTest = ref(null)

  // route home

  // route search

  // route creator
  const creator = ref(null)

  // route feed

  return {
    devTest,

    creator,
  }
})
