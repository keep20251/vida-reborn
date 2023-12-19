import { defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAccountStore } from './account'

export const useDialogStore = defineStore('dialog-store', () => {
  const accountStore = useAccountStore()
  const { isLogin } = storeToRefs(accountStore)

  const authDialog = computed(() => !isLogin.value)

  return {
    authDialog,
  }
})
