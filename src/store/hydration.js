import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHydrationStore = defineStore('hydration', () => {
  const devTest = ref(null)

  return { devTest }
})
