import useRequest from '@/compositions/request'
import { useThirdPartyAuth } from '@/compositions/request/third-party-auth'
import { useAccountStore } from '@/store/account'

export default async (to, from, next) => {
  if (import.meta.env.SSR) next()

  const { twitterOAuth, redirect_uri } = useThirdPartyAuth()
  const { setToken } = useAccountStore()

  if (
    twitterOAuth.value.oauth_token &&
    twitterOAuth.value.oauth_token_secret &&
    to.query.oauth_verifier &&
    to.query.oauth_token
  ) {
    const { data: twitterResRef, execute: twitterLogin } = useRequest('ThirdParty.loginByTwitter', {
      params: {
        oauth_verifier: decodeURIComponent(to.query.oauth_verifier),
        oauth_token: decodeURIComponent(to.query.oauth_token),
        oauth_token_secret: decodeURIComponent(twitterOAuth.value.oauth_token_secret),
      },
    })
    await twitterLogin()
    if (twitterResRef.value?.data?.token) {
      alert(`Twitter 登入成功: ${twitterResRef.value.data.token}`)
      setToken(twitterResRef.value.data.token)
    }
    return next({ name: 'home', query: {} })
  }

  if (to.query.code) {
    const googleCode = decodeURIComponent(to.query.code)
    const { data: googleResRef, execute: googleLogin } = useRequest('ThirdParty.webLoginByGoogle', {
      params: {
        redirect_uri,
        google_code: googleCode,
      },
    })
    await googleLogin()

    if (googleResRef.value?.data?.token) {
      alert(`Google 登入成功: ${googleResRef.value.data.token}`)
      setToken(googleResRef.value.data.token)
    }
    return next({ name: 'home', query: {} })
  }

  next()
}
