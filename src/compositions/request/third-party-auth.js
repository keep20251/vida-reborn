import useRequest from '@/compositions/request'
import { useLocalStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAppleSignIn } from '@/utils/apple.js'
import { readonly } from 'vue'

export function useThirdPartyAuth() {
  /**
   * 第三方登入後重定向的網址，告訴 Google, Twitter 要往哪個網址送GET參數過去
   */
  const redirect_uri = import.meta.env.VITE_APP_URL

  const { bindEvents: bindAppleEvent, unbindEvents: unbindAppleEvent, onAppleSignIn } = useAppleSignIn()

  const route = useRoute()

  /**
   * 向後端請求取得 Twitter 登入頁面的網址
   */
  const { data: twitterRedirection, execute: getRedirectToTwitter } = useRequest('ThirdParty.getRedirectToTwitter', {
    params: {
      redirect_uri,
    },
    onSuccess: (responseData) => {
      console.log('onSuccess', responseData)
    },
  })

  const twitterOAuth = useLocalStorage('twitterOAuth', {})

  /**
   * 點擊 Twitter 登入按鈕後，向後端請求取得 Twitter 登入頁面的網址
   * 然後將網址帶到前端，並導向 Twitter 登入頁面
   */
  async function twitterLogin() {
    try {
      await getRedirectToTwitter()
      console.log('twitterRedirection', twitterRedirection.value.data)
      twitterOAuth.value = twitterRedirection.value.data
      window.location.href = twitterRedirection.value.data.url
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * 判斷是否為 Twitter 登入成功後的網址
   * 是的話，就向後端請求取得 token
   */
  async function bindTwitterSuccess() {
    if (
      twitterOAuth.value.oauth_token &&
      twitterOAuth.value.oauth_token_secret &&
      route.query.oauth_verifier &&
      route.query.oauth_token
    ) {
      await onTwitterLoginSuccess()
    }
  }

  /**
   * Twitter 登入成功後，Twitter 會將 oauth_verifier, oauth_token, oauth_token_secret 這三個參數帶在網址上
   * 然後再向後端請求取得 token
   */
  function onTwitterLoginSuccess() {
    useRequest('ThirdParty.loginByTwitter', {
      params: {
        oauth_verifier: route.query.oauth_verifier,
        oauth_token: route.query.oauth_token,
        oauth_token_secret: twitterOAuth.value.oauth_token_secret,
      },
      onSuccess: (responseData) => {
        alert(`Twitter login success! token:${responseData.data.token}`)
        twitterOAuth.value = {}
      },
      immediate: true,
    })
  }

  /**
   * 向後端請求取得 Google 登入頁面的網址
   */
  const { data: googleRedirection, execute: getGoogleOuathPage } = useRequest('ThirdParty.getGoogleOauthPage', {
    params: {
      redirect_uri,
    },
    onSuccess: (responseData) => {
      console.log('onSuccess', responseData)
    },
  })

  const googleOAuth = useLocalStorage('googleOAuth', {})

  /**
   * 點擊 Google 登入按鈕後，向後端請求取得 Google 登入頁面的網址
   * 然後將網址帶到前端，並導向 Google 登入頁面
   */
  async function googleLogin() {
    await getGoogleOuathPage()
    console.log('googleRedirection', googleRedirection.value.data.url)

    googleOAuth.value = googleRedirection.value.data
    window.location.href = googleRedirection.value.data.url
  }

  /**
   * 判斷是否為 Google 登入成功後的網址
   * 是的話，就向後端請求取得 token
   */
  async function bindGoogleSuccess() {
    if (route.query.code) await onGoogleLoginSuccess()
  }

  /**
   * Google 登入成功後，Google 會將 code 這個參數帶在網址上
   * 然後再向後端請求取得 token
   */
  async function onGoogleLoginSuccess() {
    console.log('onGoogleLoginSuccess', route.query.code)
    const googleCode = decodeURIComponent(route.query.code)
    useRequest('ThirdParty.webLoginByGoogle', {
      params: {
        redirect_uri,
        google_code: googleCode,
      },
      onSuccess: (responseData) => {
        alert(`Google login success! token:${responseData.data.token}`)
      },
      immediate: true,
    })
  }

  /**
   * 蘋果登入成功後向後端請求取得 token
   * @param {Object} event
   */
  async function onAppleLoginSuccess(event) {
    console.log('onAppleLoginSuccess', event)

    const { code } = event
    useRequest('ThirdParty.webLoginByApple', {
      params: {
        redirect_uri,
        apple_code: code,
      },
      onSuccess: (responseData) => {
        console.log('ThirdParty.webLoginByApple.response', responseData)
        alert(`Apple login success! token:${responseData.data.token}`)
      },
      onError: (err) => {
        console.error(err)
      },
      immediate: true,
    })
  }

  return {
    redirect_uri: readonly(redirect_uri),
    twitterOAuth,
    googleOAuth,
    twitterLogin,
    googleLogin,
    bindTwitterSuccess,
    bindGoogleSuccess,
    bindAppleEvent,
    unbindAppleEvent,
    onAppleSignIn,
    onAppleLoginSuccess,
  }
}
