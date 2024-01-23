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
  })

  const twitterOAuth = useLocalStorage('twitterOAuth', {})

  /**
   * 點擊 Twitter 登入按鈕後，向後端請求取得 Twitter 登入頁面的網址
   * 然後將網址帶到前端，並導向 Twitter 登入頁面
   */
  async function twitterLogin() {
    try {
      await getRedirectToTwitter()
      console.log('twitterRedirection', twitterRedirection.value)
      twitterOAuth.value = twitterRedirection.value
      window.location.href = twitterRedirection.value.url
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
  })

  const googleOAuth = useLocalStorage('googleOAuth', {})

  /**
   * 點擊 Google 登入按鈕後，向後端請求取得 Google 登入頁面的網址
   * 然後將網址帶到前端，並導向 Google 登入頁面
   */
  async function googleLogin() {
    await getGoogleOuathPage()
    console.log('googleRedirection', googleRedirection.value.url)

    googleOAuth.value = googleRedirection.value
    window.location.href = googleRedirection.value.url
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
  }
}
