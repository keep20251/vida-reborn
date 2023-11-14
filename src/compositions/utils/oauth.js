import { ref, readonly } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'

const OAUTH_ID_KEY = '__OAUTH_ID'

export function useOauth() {
  const oauthId = useLocalStorage(OAUTH_ID_KEY, uuidv4())
  const oauthType = readonly(ref('pwa'))
  const version = readonly(ref('1.1'))

  return {
    oauthId,
    oauthType,
    version,
  }
}
