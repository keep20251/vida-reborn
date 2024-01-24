import '@/style.scss'
// import API from '@/http'
// import { storeToRefs } from 'pinia'
// import { useAppStore } from '@/store/app'
// import { useAccountStore } from '@/store/account'
// import { useCreditCardStore } from '@/store/credit-card'
// import { init } from '@/ws'
// import { nextTick } from 'vue'

import { createApp } from './main'
import { hydrated } from '@use/lifecycle'
import { setupStoreHydrate } from '@/utils/init'
import { useAppleSignIn } from '@/utils/apple'
import { createI18n } from '@/i18n'
import { useCookies } from '@vueuse/integrations/useCookies'
import { COOKIE_KEY } from '@const'

createApp()
  .then(async ({ app, router, store }) => {
    const cookies = useCookies()
    const locale = cookies.get(COOKIE_KEY.LOCALE, { path: '/' })

    const i18n = await createI18n(locale)
    app.use(i18n)

    router.isReady().then(async () => {
      const { setupAppleInit } = useAppleSignIn()

      setupStoreHydrate(store)
      setupAppleInit()

      app.mount('#app')
      hydrated()

      console.log('[Hydrated] client side is mounted')
    })
  })
  .catch((err) => {
    console.error(err)
  })
