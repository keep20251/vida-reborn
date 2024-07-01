import { readonly, ref } from 'vue'
import { createSharedComposable, useScrollLock } from '@vueuse/core'

export const useRootScrollLock = createSharedComposable(() => {
  if (import.meta.env.SSR) {
    return {
      isLocked: readonly(ref(false)),
      lock() {},
      unlock() {},
    }
  }

  const isLocked = useScrollLock(document.getElementsByTagName('html')[0])
  function lock() {
    if (typeof lock.lockCount !== 'number') {
      lock.lockCount = 0
    }
    isLocked.value = true
    lock.lockCount++
  }
  function unlock() {
    if (lock.lockCount > 0) {
      lock.lockCount--
    }
    if (lock.lockCount === 0) {
      isLocked.value = false
    }
  }

  return {
    isLocked: readonly(isLocked),
    lock,
    unlock,
  }
})
