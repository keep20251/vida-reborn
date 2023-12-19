import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog-store', () => {
  const authDialog = ref(false)

  return {
    authDialog,
  }
})
