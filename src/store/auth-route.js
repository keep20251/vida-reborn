// import CreatePassword from '@/components/auth/CreatePassword.vue'
import MainPage from '@/components/auth/MainPage.vue'
import SignUp from '@/components/auth/SignUp.vue'
// import UserProfile from '@/components/auth/UserProfile.vue'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { AUTH_ROUTES } from '@/constant'
import { useDialogStore } from '@/store/dialog'

// import { trackEvent } from '@/gtm'

export const useAuthRouteStore = defineStore('authRoute', () => {
  const { authDialog } = storeToRefs(useDialogStore())

  const routes = [
    { value: AUTH_ROUTES.MAIN_PAGE, component: MainPage },
    { value: AUTH_ROUTES.SIGN_UP, component: SignUp },
    // { value: AUTH_ROUTES.CREATE_PASSWORD, component: CreatePassword },
    // { value: AUTH_ROUTES.USER_PROFILE, component: UserProfile },
  ]

  const now = ref(AUTH_ROUTES.MAIN_PAGE)
  const authComponent = computed(() => routes.find((route) => route.value === now.value).component)

  function to(value) {
    // triggerGtm(value)
    now.value = value
  }

  function close() {
    now.value = AUTH_ROUTES.MAIN_PAGE
    authDialog.value = false
  }

  //   function triggerGtm(route) {
  //     switch (route) {
  //       case AUTH_ROUTES.LOGIN:
  //         trackEvent({ key: 38 })
  //         break
  //       case AUTH_ROUTES.SIGN_UP:
  //         trackEvent({ key: 40 })
  //         break
  //       case AUTH_ROUTES.CREATE_PASSWORD:
  //         trackEvent({ key: 41 })
  //         break
  //       case AUTH_ROUTES.USER_PROFILE:
  //         trackEvent({ key: 42 })
  //         break
  //       default:
  //         console.error('gtmTrack: unknown route')
  //         break
  //     }
  //   }

  return { now, authComponent, to, close }
})
