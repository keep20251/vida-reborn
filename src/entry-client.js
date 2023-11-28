import '@/style.scss'
// import API from '@/http'
import { createApp } from './main'
import { hydrated } from '@/compositions/lifecycle'
// import { createGtm } from '@/gtm'
// import { storeToRefs } from 'pinia'
// import { useAppStore } from '@/store/app'
// import { useAccountStore } from '@/store/account'
// import { useCreditCardStore } from '@/store/credit-card'
// import { init } from '@/ws'
// import { nextTick } from 'vue'

const { app, router, store } = createApp()
router.isReady().then(() => {
  //   if (import.meta.env.VITE_GTM_ID) {
  //     app.use(createGtm(router))
  //   }

  if (window.__INITIAL_STATE__) {
    store.state.value = JSON.parse(window.__INITIAL_STATE__)
    if (!import.meta.env.DEV) {
      document.getElementById('ssr-store').remove()
    }
    console.log('[hydrated]Pinia state is hydrated')
  }

  app.mount('#app')
  hydrated()
  console.log('[hydrated]Client side is mounted')

  //   initGlobalData().then(() => {})

  // ios safari 開啟鍵盤後在任何可滑動元件上快速點擊會讓整個畫面往上移動
  // 最後只找到這個方式把雙擊事件關掉
  // 如果整個應用有需要使用雙擊事件可能要深思熟慮一下
  document.addEventListener('dblclick', (evt) => evt.preventDefault())
})

// async function initGlobalData() {
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

//   // 初始化IM
//   init()
// }
