import { readonly } from 'vue'
import { useScrollLock } from '@vueuse/core'

export default function useRootScrollLock() {
  const root = document.getElementsByTagName('html')[0]
  if (!root) {
    console.error('html element not found')
    return
  }

  const isLocked = useScrollLock(root)
  const lock = () => (isLocked.value = true)
  const unlock = () => (isLocked.value = false)

  return {
    isLocked: readonly(isLocked),
    lock,
    unlock,
  }
}
