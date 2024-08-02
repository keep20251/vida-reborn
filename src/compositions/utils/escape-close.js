import { ref } from 'vue'
import { createSharedComposable, onKeyStroke } from '@vueuse/core'

export const useEscapeClose = createSharedComposable(() => {
  const stack = ref([])

  function push(eventElemnt = { key: null, target: null, fn: null }) {
    stack.value.push(eventElemnt)
  }

  function pop() {
    if (stack.value.length === 0) return

    const { target, fn } = stack.value.pop()
    target && fn && fn()
  }

  function remove(_key) {
    if (stack.value.length === 0) return

    const index = stack.value.findIndex(({ key }) => key === _key)
    if (index !== -1) stack.value.splice(index, 1)
  }

  onKeyStroke('Escape', pop)

  return {
    push,
    remove,
  }
})
