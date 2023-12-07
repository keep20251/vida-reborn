// import { createGtm } from '@/gtm'

export function setupStoreHydrate(store) {
  if (window.__INITIAL_STATE__) {
    store.state.value = JSON.parse(window.__INITIAL_STATE__)
    if (!import.meta.env.DEV) {
      document.getElementById('ssr-store').remove()
    }
    console.log('[hydrated]Pinia state is hydrated')
  }
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
