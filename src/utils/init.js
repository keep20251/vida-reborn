// import { createGtm } from '@/gtm'
import { useHead, useSeoMeta } from '@unhead/vue'
import { storeToRefs } from 'pinia'
import { useHeadStore } from '@/store/head'
import { useLocale } from '@use/utils/locale'

export function setupStoreHydrate(store) {
  if (window.__INITIAL_STATE__) {
    store.state.value.hydration = JSON.parse(window.__INITIAL_STATE__)
    if (!import.meta.env.DEV) {
      document.getElementById('ssr-state').remove()
    }
    console.log('[Hydration] Pinia hydration store is reverted', store.state.value.hydration)
  }
}

export function loadSeoHead() {
  const locale = useLocale()
  const {
    title,
    description,
    keywords,
    author,
    publishTime: articlePublishedTime,
    tags: articleTag,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
    alternates,
    jsonldSchema,
  } = storeToRefs(useHeadStore())

  useSeoMeta({
    title,
    description,
    keywords,
    author,
    articlePublishedTime,
    articleTag,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  })
  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonical,
      },
      ...alternates.value,
    ],
    htmlAttrs: {
      lang: locale,
    },
    script: [
      {
        key: 'json-ld-schema',
        innerHTML: jsonldSchema,
        type: 'application/ld+json',
      },
    ],
  })
}

export function setupGoogleTagManager() {
  // if (import.meta.env.VITE_GTM_ID) {
  //   app.use(createGtm(router))
  // }
}

// export async function initGlobalData() {
//   const appStore = useAppStore()
//   const { initAppConfig } = appStore

//   const accountStore = useAccountStore()
//   const { isLogin } = storeToRefs(accountStore)
//   const { resetUserData } = accountStore

//   const creditCardStore = useCreditCardStore()
//   const { cardList } = storeToRefs(creditCardStore)

//   // 初始化全域參數
//   await initAppConfig()

//   // 有登入
//   if (isLogin.value) {
//     // 初始化自己的資料
//     const data = await API.Auth.detail()
//     resetUserData(data)

//     await nextTick()

//     API.CreditCard.list({ data: { page: 1, limit: 10 } })
//       .then((response) => {
//         cardList.value = response
//       })
//       .catch((e) => {
//         console.error(e)
//       })
//   }
