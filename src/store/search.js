import { computed, readonly, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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
  const hasQuery = computed(() => keyword.value !== '')

  function setKeyword(value = '') {
    keyword.value = value
  }

  function reset() {
    activeTab.value = SEARCH_TAB.POST
    keyword.value = ''
  }

  const feedStore = useFeedStore()
  const articleParams = { filter_by: 0, user_interested: 1, include_my_article: 1 }
  const articleFetcher = ref(
    useInfinite('Article.list', {
      params: { keyword: keyword.value, ...articleParams },
      transformer: feedStore.sync,
    }),
  )

  const creatorParams = {}
  const creatorFetcher = ref(
    useInfinite('User.searchCreator', {
      params: { keyword: keyword.value, ...creatorParams },
    }),
  )

  const requestParams = computed(() =>
    activeTab.value === SEARCH_TAB.AUTHOR
      ? { keyword: keyword.value, ...creatorParams }
      : { keyword: keyword.value, ...articleParams },
  )

  const nextAction = computed(() =>
    hasQuery.value
      ? activeTab.value === SEARCH_TAB.AUTHOR
        ? creatorFetcher.value.next
        : articleFetcher.value.next
      : void 0,
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
    reloadAction.value({ newParams: requestParams.value })

    if (historyTags.value.find((tag) => tag.value === value)) return
    historyTags.value.push({ value, label: value })
  }

  const { to } = useRouters()
  const route = useRoute()
  watch([() => route.name, () => route.query.q], ([name, q]) => {
    if (name === 'search') {
      console.log('watch route search', { name, q })
      if (q && q !== keyword.value) {
        onSearch(q)
      } else {
        if (hasQuery.value) {
          to('search', { query: { q: keyword.value } })
        } else {
          to('search')
        }
      }
    }
  })

  return {
    activeTab,
    keyword: readonly(keyword),
    hasQuery,
    setKeyword,
    reset,

    nextAction,
    reloadAction,
    initAction,
    dataList,
    requestParams,

    articleFetcher,
    creatorFetcher,

    popularTags,
    fetchPopularTags,
    clearHistoryTags,
    historyTags,
  }
})
