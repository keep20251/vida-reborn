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
  const forYou = ref(null)

  // route search
  const relatedAuthors = ref([])

  // route creator
  const creator = ref(null)
  const creatorArticleList = ref(null)
  const creatorError = ref(null)

  // route feed
  const feed = ref(null)
  const feedComments = ref(null)
  const feedError = ref(null)

  // route mine
  const mineCreatorArticles = ref(null)
  const mineRegisterArticles = ref(null)
  const mineBoughtArticles = ref(null)
  const mineTransactionList = ref(null)
  const mineSubList = ref(null)
  const mineBlockList = ref(null)

  const prodData = {
    appConfig,
    categories,
    userData,

    relatedAuthors,

    forYou,

    creator,
    creatorArticleList,
    creatorError,

    feed,
    feedComments,
    feedError,

    mineCreatorArticles,
    mineRegisterArticles,
    mineBoughtArticles,
    mineTransactionList,
    mineSubList,
    mineBlockList,
  }

  return import.meta.env.DEV ? { devTest, ...prodData } : prodData
})
