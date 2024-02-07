import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog-store', () => {
  const authDialog = ref(false)
  const fileSelectDialog = ref(false)
  const subPlanDialog = ref(false)

  return {
    authDialog,
    fileSelectDialog,
    subPlanDialog,
  }
})
