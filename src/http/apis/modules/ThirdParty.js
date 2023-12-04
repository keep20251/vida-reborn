/**
 * 發文 API
 */
export default {
  getRedirectToTwitter: { method: 'post', url: '/api/thirdparty/getRedirectToTwitter' },
  loginByTwitter: { method: 'post', url: '/api/thirdparty/loginByTwitter' },
  getGoogleOauthPage: { method: 'post', url: '/api/thirdparty/getGoogleOauthPage' },
  webLoginByGoogle: { method: 'post', url: '/api/thirdparty/webLoginByGoogle' },
}
