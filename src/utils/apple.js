import md5 from 'md5'
import { v4 } from 'uuid'

/**
 * Apple SSO
 * @deprecated It should be refactor in the future.
 * @link [Apple Webpage Doc](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple)
 */
export function useAppleSignIn() {
  function setupAppleInit() {
    const state = 'vida-apple-init-state'
    const nonce = md5(v4() + 'vida-apple-init-nonce')

    window.AppleID.auth.init({
      clientId: 'cc.test.vida',
      scope: 'name email',
      redirectURI: import.meta.env.VITE_APP_URL,
      state,
      nonce,
      usePopup: true,
    })
  }

  function bindEvents({ onSuccess = null, onFailure = null }) {
    document.addEventListener('AppleIDSignInOnSuccess', (event) => {
      console.log('AppleIDSignInOnSuccess', event)
      onSuccess && onSuccess(event.detail.authorization)
    })
    document.addEventListener('AppleIDSignInOnFailure', (event) => {
      console.error('AppleIDSignInOnFailure', event)
      onFailure && onFailure(event)
    })
    console.log(`Apple event listener is bound.`)
  }

  function unbindEvents() {
    document.removeEventListener('AppleIDSignInOnSuccess', () => {})
    document.removeEventListener('AppleIDSignInOnFailure', () => {})
    console.log(`Apple event listener is unbound.`)
  }

  async function onAppleSignIn({ onSuccess = null, onFailure = null }) {
    try {
      const response = await window.AppleID.auth.signIn()
      onSuccess && onSuccess(response.authorization)
    } catch (e) {
      console.error(e)
      onFailure && onFailure(e)
    }
  }

  return { setupAppleInit, bindEvents, unbindEvents, onAppleSignIn }
}
