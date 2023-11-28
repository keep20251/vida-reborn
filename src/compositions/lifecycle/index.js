import { onMounted, onServerPrefetch } from 'vue'

let _isHydration = true

/*
 * 注意！
 * 此函式僅能透過 client-entry 在 vue app hydration 完成後呼叫
 */
export function hydrated() {
  _isHydration = false
}

/*
 * SSR 一定會執行
 * 初次到前端開始 CSR 時一開始會進入 hydration 階段，因為 SSR 已經執行過了所以會跳過不執行
 * 若執行的當下已經不是 hydration 階段的話才會執行
 */
export function onServerClientOnce(fn) {
  const hook = async () => {
    if (import.meta.env.SSR || !_isHydration) {
      await fn()
    }
  }
  onMounted(hook)
  onServerPrefetch(hook)
}

/*
 * CSR 的 hydration 階段才會執行
 */
export function onHydration(fn) {
  onMounted(async () => {
    if (_isHydration) {
      await fn()
    }
  })
}
