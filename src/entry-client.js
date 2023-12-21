import '@/style.scss'
// import API from '@/http'
// import { storeToRefs } from 'pinia'
// import { useAppStore } from '@/store/app'
// import { useAccountStore } from '@/store/account'
// import { useCreditCardStore } from '@/store/credit-card'
// import { init } from '@/ws'
// import { nextTick } from 'vue'

import { createApp } from './main'
import { hydrated } from '@/compositions/lifecycle'
import { setupStoreHydrate } from '@/utils/init'
import { useAppleSignIn } from '@/utils/apple'
import { useI18n } from '@/i18n'

createApp()
  .then(async ({ app, router, store }) => {
    const i18n = await useI18n().initI18n()
    app.use(i18n)

    router.isReady().then(async () => {
      const { setupAppleInit } = useAppleSignIn()

      setupStoreHydrate(store)
      setupAppleInit()

      app.mount('#app')
      hydrated()
      console.log('[hydrated]Client side is mounted')

      //   initGlobalData().then(() => {})

      // ios safari 開啟鍵盤後在任何可滑動元件上快速點擊會讓整個畫面往上移動
      // 最後只找到這個方式把雙擊事件關掉
      // 如果整個應用有需要使用雙擊事件可能要深思熟慮一下
      document.addEventListener('dblclick', (evt) => evt.preventDefault())
    })
  })
  .catch((err) => {
    console.error(err)
  })
