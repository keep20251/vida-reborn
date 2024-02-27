import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useFeedStore } from '@/store/feed'
import useRequest from '@use/request'
import { useInfinite } from '@use/request/infinite'
import { useRouters } from '@use/routers'
import { LOCAL_STORAGE_KEYS, SEARCH_TAB } from '@const'

export const useSearchStore = defineStore('search-store', () => {
  const activeTab = ref(SEARCH_TAB.POST)
  const keyword = ref('')

  function reset() {
    activeTab.value = SEARCH_TAB.AUTHOR
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
    popularTags.value = data.list.map((tag) => ({ value: tag.name, label: tag.name }))
  }

  const historyTags = useLocalStorage(LOCAL_STORAGE_KEYS.HISTORY_TAGS, [])

  function clearHistoryTags() {
    historyTags.value = []
  }

  const { to } = useRouters()

  function onSearch(q) {
    to('search', { query: { q } })
  }

  return {
    activeTab,
    keyword,
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
