import { computed, readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useFeedStore } from '@/store/feed'
import useRequest from '@use/request'
import { useInfinite } from '@use/request/infinite'
import { LOCAL_STORAGE_KEYS, SEARCH_TAB } from '@const'

export const useSearchStore = defineStore('search-store', () => {
  const activeTab = ref(SEARCH_TAB.POST)
  const keyword = ref('')

  function setKeyword(value) {
    keyword.value = value
  }

  function reset() {
    activeTab.value = SEARCH_TAB.POST
    keyword.value = ''
  }

  const feedStore = useFeedStore()
  const articleFetcher = ref(
    useInfinite('Article.list', {
      params: { filter_by: 0, user_interested: 1, include_my_article: 1 },
      transformer: feedStore.sync,
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

  const popularTags = ref([])

  async function fetchPopularTags() {
    const data = await useRequest('Article.hotKeywords', { immediate: true })
    popularTags.value = data.map((tag) => ({ value: tag.name, label: tag.name }))
  }

  const historyTags = useLocalStorage(LOCAL_STORAGE_KEYS.HISTORY_TAGS, [])

  function clearHistoryTags() {
    historyTags.value = []
  }

  function onSearch(value) {
    setKeyword(value)
    reloadAction.value({ newParams: { keyword: value } })

    if (historyTags.value.find((tag) => tag.value === value)) return
    historyTags.value.push({ value, label: value })
  }

  return {
    activeTab,
    keyword: readonly(keyword),
    setKeyword,
    reset,

    nextAction,
    reloadAction,
    initAction,
    dataList,

    articleFetcher,
    creatorFetcher,

    popularTags,
    fetchPopularTags,
    clearHistoryTags,
    historyTags,

    onSearch,
  }
})
