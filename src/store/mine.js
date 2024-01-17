import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MINE_TITLE } from '@/constant'

export const useMineStore = defineStore('mine-store', () => {
  const title = ref('title.mine')

  function updateTitle(routeName) {
    title.value = MINE_TITLE[routeName]
  }

  return { title, updateTitle }
})
