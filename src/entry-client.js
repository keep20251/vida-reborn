import { useCookies } from '@vueuse/integrations/useCookies'
import { hydrated } from '@use/lifecycle'
import { COOKIE_KEY } from '@const'
import { useAppleSignIn } from '@/utils/apple'
import { setupStoreHydrate } from '@/utils/init'
import { createI18n } from '@/i18n'
import '@/style.scss'
import { createApp } from './main'

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
