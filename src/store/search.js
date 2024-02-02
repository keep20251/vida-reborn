import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SEARCH_TAB } from '@const'

export const useSearchStore = defineStore('search-store', () => {
  const activeTab = ref(SEARCH_TAB.AUTHOR)
  const keyword = ref('')

  const nextAction = ref(null)
  const reloadAction = ref(null)

  return {
    activeTab,
    keyword,

    nextAction,
    reloadAction,
  }
})
