import MainPage from '@/components/auth/MainPage.vue'
import SignUp from '@/components/auth/SignUp.vue'
import VerifyEmailCode from '@/components/auth/VerifyEmailCode.vue'
import VerifyPassword from '@/components/auth/VerifyPassword.vue'
import Login from '@/components/auth/Login.vue'
import SignUpSuccess from '@/components/auth/SignUpSuccess.vue'

import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, readonly } from 'vue'
import { AUTH_ROUTES } from '@/constant'
import { useDialogStore } from '@/store/dialog'

// import { trackEvent } from '@/gtm'

export const useAuthRouteStore = defineStore('authRoute', () => {
  const { authDialog } = storeToRefs(useDialogStore())

  const routes = [
    { value: AUTH_ROUTES.MAIN_PAGE, component: MainPage },
    { value: AUTH_ROUTES.LOGIN, component: Login },
    { value: AUTH_ROUTES.SIGN_UP, component: SignUp },
    { value: AUTH_ROUTES.VERIFY_EMAIL_CODE, component: VerifyEmailCode },
    { value: AUTH_ROUTES.VERIFY_PASSWORD, component: VerifyPassword },
    { value: AUTH_ROUTES.SIGN_UP_SUCCESS, component: SignUpSuccess },
  ]

  const now = ref(AUTH_ROUTES.MAIN_PAGE)
  const authComponent = computed(() => routes.find((route) => route.value === now.value).component)
  const history = ref([])

  function to(value) {
    // triggerGtm(value)
    history.value.push(now.value)
    now.value = value
  }

  function back() {
    if (history.value.length <= 0) {
      throw new Error('[Auth Route Error] History is empty, you shoud not call back()')
    }
    now.value = history.value.pop()
  }

  function close() {
    now.value = AUTH_ROUTES.MAIN_PAGE
    authDialog.value = false
    history.value = []
  }

  function open(curr = AUTH_ROUTES.MAIN_PAGE) {
    now.value = curr
    authDialog.value = true
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

  return { authComponent, history: readonly(history), to, back, close, open }
})
