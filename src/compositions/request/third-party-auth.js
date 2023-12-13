import useRequest from '@/compositions/request'
import { useLocalStorage } from '@vueuse/core'
import { useAppleSignIn } from '@/utils/apple.js'

export function useThirdPartyAuth() {
  /**
   * 第三方登入後重定向的網址，告訴 Google, Twitter 要往哪個網址送GET參數過去
   */
  const redirect_uri = import.meta.env.VITE_APP_URL

  const { bindEvents: bindAppleEvent, unbindEvents: unbindAppleEvent, onAppleSignIn } = useAppleSignIn()

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
    redirect_uri,
    twitterOAuth,
    googleOAuth,
    twitterLogin,
    googleLogin,
    bindAppleEvent,
    unbindAppleEvent,
    onAppleSignIn,
    onAppleLoginSuccess,
  }
}
