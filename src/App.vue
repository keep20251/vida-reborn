<template>
  <router-view></router-view>
  <ClientOnly>
    <CookieBanner></CookieBanner>
    <Modal></Modal>
  </ClientOnly>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { onBeforeMount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useHydrationStore } from '@/store/hydration'
import CookieBanner from '@comp/banner/CookieBanner.vue'
import Modal from '@comp/modal/index.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import useRequest from '@use/request'
import { useRouters } from '@use/routers'
import { useCookie } from '@use/utils/cookie'
import { useLocale } from '@use/utils/locale'
import { COOKIE_KEY } from '@const'
import { loadSeoHead } from '@/utils/init'
import { init } from '@/ws'

const appStore = useAppStore()
const { initAppConfig, setAppConfig, initCategories, setCategories } = appStore

loadSeoHead()

const accountStore = useAccountStore()
const { resetUserData, logout } = accountStore
const { token } = storeToRefs(accountStore)

const hydrationStore = useHydrationStore()
const { appConfig, categories, userData } = storeToRefs(hydrationStore)

const execTable = {
  base: [
    { name: 'appConfig', fetcher: initAppConfig, hydrationTarget: appConfig, hydrationAction: setAppConfig },
    { name: 'categories', fetcher: initCategories, hydrationTarget: categories, hydrationAction: setCategories },
  ],
  login: [
    {
      name: 'userData',
      fetcher: async () => {
        const data = await useRequest('User.info', { immediate: true })
        resetUserData(data)
        return data
      },
      hydrationTarget: userData,
      hydrationAction: resetUserData,
    },
  ],
}
onServerClientOnce(async (isSSR) => {
  const executors = token.value ? [...execTable.base, ...execTable.login] : [...execTable.base]
  try {
    const datas = await Promise.allSettled(executors.map((e) => e.fetcher()))
    if (isSSR) {
      executors.forEach(({ hydrationTarget }, i) => {
        hydrationTarget.value = datas[i]
      })
    }
  } catch (e) {
    console.error(e)
  }
})
onHydration(() => {
  const executors = token.value ? [...execTable.base, ...execTable.login] : [...execTable.base]
  for (const { name, hydrationAction, hydrationTarget } of executors) {
    const { status, value, reason } = hydrationTarget.value
    if (status === 'fulfilled') {
      hydrationAction(value)
      console.log('[Hydration]', name, 'is reverted', value)
    } else {
      logout()
      console.log('[Hydration]', name, 'is rejected', reason)
      break
    }
  }
})

// IM 模組初始化
const guestId = useCookie(COOKIE_KEY.GUEST_ID, { default: uuidv4, readonly: true })
onMounted(() => init({ oauthId: guestId.value }))

// 已經登入帳戶又在 landing 的話就導到 home
const locale = useLocale()
const route = useRoute()
const { replace } = useRouters()
onBeforeMount(() => {
  if (route.name === 'landing' && token.value) {
    replace('home', { params: { lang: locale.value } })
  }
})
</script>
