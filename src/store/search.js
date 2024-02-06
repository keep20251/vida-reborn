import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useInfinite } from '@use/request/infinite'
import { SEARCH_TAB } from '@const'

export const useSearchStore = defineStore('search-store', () => {
  const activeTab = ref(SEARCH_TAB.AUTHOR)
  const keyword = ref('')

  const articleFetcher = ref(
    useInfinite('Article.list', {
      params: {},
    }),
  )

  const creatorFetcher = ref(
    useInfinite('User.searchCreator', {
      params: {},
    }),
  )

  const nextAction = computed(() =>
    activeTab.value === SEARCH_TAB.AUTHOR ? creatorFetcher.value.next : articleFetcher.value.next,
  )

  const reloadAction = computed(() =>
    activeTab.value === SEARCH_TAB.AUTHOR ? creatorFetcher.value.reload : articleFetcher.value.reload,
  )

  const initAction = computed(() =>
    activeTab.value === SEARCH_TAB.AUTHOR ? creatorFetcher.value.init : articleFetcher.value.init,
  )

  const dataList = computed(() =>
    activeTab.value === SEARCH_TAB.AUTHOR ? creatorFetcher.value.dataList : articleFetcher.value.dataList,
  )

  return {
    activeTab,
    keyword,

    nextAction,
    reloadAction,
    initAction,
    dataList,

    articleFetcher,
    creatorFetcher,
  }
})
