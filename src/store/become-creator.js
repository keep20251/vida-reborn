import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBecomeCreatorStore = defineStore('become-creator-store', () => {
  const identity = ref(1)
  const country = ref('CN')

  const identityFileUrl = ref(null)
  const faceFileUrl = ref(null)

  return {
    identity,
    country,
    identityFileUrl,
    faceFileUrl,
  }
})
