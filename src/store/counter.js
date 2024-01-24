import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

// 測試用的 Store，之後可以刪掉
export const useCounterStore = defineStore('counter-store', () => {
  const counter = ref(0)

  function increment() {
    counter.value++
  }

  watch(counter, (newValue) => {
    console.log('counter changed', newValue)
  })

  return {
    counter,
    increment,
  }
})
