import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog-store', () => {
  const authDialog = ref(false)

  return {
    authDialog,
  }
})
