import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHydrationStore = defineStore('hydration', () => {
  // route devmode/hydration
  const devTest = ref(null)

  // 前置資料
  const appConfig = ref(null)
  const categories = ref(null)
  const userData = ref(null)

  // route home
  const homeFeeds = ref(null)
  const homeCreators = ref(null)

  // route search
  const relatedAuthors = ref([])
  const relatedFeeds = ref([])
  const keyword = ref('')
  const popularTags = ref([])

  // route creator
  const creator = ref(null)
  const creatorArticleList = ref(null)
  const creatorError = ref(null)

  // route feed
  const feed = ref(null)
  const feedComments = ref(null)
  const feedError = ref(null)

  const prodData = {
    appConfig,
    categories,
    userData,

    relatedAuthors,
    relatedFeeds,
    keyword,
    popularTags,

    homeFeeds,
    homeCreators,

    creator,
    creatorArticleList,
    creatorError,

    feed,
    feedComments,
    feedError,
  }

  return import.meta.env.DEV ? { devTest, ...prodData } : prodData
})
