import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PERMISSION } from '../constant'

export const usePermissionStore = defineStore('permissionStore', () => {
  const role = ref(PERMISSION.VISITOR)

  const permission = computed(() => {
    if (role.value === PERMISSION.VISITOR) {
      return PERMISSION.VISITOR
    } else if (role.value === PERMISSION.REGISTERED) {
      return PERMISSION.REGISTERED
    } else {
      return PERMISSION.CREATOR
    }
  })
  return {
    role,
    permission,
  }
})
