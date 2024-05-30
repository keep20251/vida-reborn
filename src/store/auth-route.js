import { computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import { useEmailLoginStore } from '@/store/email-login'
import Login from '@comp/auth/Login.vue'
import MainPage from '@comp/auth/MainPage.vue'
import SignUp from '@comp/auth/SignUp.vue'
import SignUpSuccess from '@comp/auth/SignUpSuccess.vue'
import VerifyEmailCode from '@comp/auth/VerifyEmailCode.vue'
import VerifyPassword from '@comp/auth/VerifyPassword.vue'
import { AUTH_ROUTES } from '@const/index'
import { useHistory } from '@/compositions/routers/history'

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

  const { now, history, goto, back, init } = useHistory({ initValue: AUTH_ROUTES.MAIN_PAGE })
  const authComponent = computed(() => routes.find((route) => route.value === now.value).component)

  const emailLoginStore = useEmailLoginStore()

  function close() {
    init(AUTH_ROUTES.MAIN_PAGE)
    authDialog.value = false
    emailLoginStore.$reset()
  }

  function open(curr = AUTH_ROUTES.MAIN_PAGE) {
    init(curr)
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

  return { authComponent, history, to: goto, back, close, open }
})
