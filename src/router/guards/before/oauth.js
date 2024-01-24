import useRequest from '@use/request'
import { useThirdPartyAuth } from '@use/request/third-party-auth'
import { useAccountStore } from '@/store/account'
import { useLocaleReadonly } from '@use/utils/localeReadonly'

export default async (to, from) => {
  if (import.meta.env.SSR) {
    return
  }

  const { twitterOAuth, redirect_uri } = useThirdPartyAuth()
  const { login } = useAccountStore()
  const locale = useLocaleReadonly()

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
    console.log(twitterResRef.value)
    if (twitterResRef.value?.token) await login(twitterResRef.value.token)
    return { name: 'home', params: { lang: locale.value } }
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

    if (googleResRef.value?.token) await login(googleResRef.value.token)
    return { name: 'home', params: { lang: locale.value } }
  }
}
