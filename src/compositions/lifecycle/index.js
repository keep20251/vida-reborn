import { onBeforeMount, onServerPrefetch } from 'vue'

let _isHydration = true

/*
 * 注意！
 * 此函式僅能透過 client-entry 在 vue app hydration 完成後呼叫
 */
export function hydrated() {
  _isHydration = false
}

/*
 * 必須在 vue component setup 期間掛載的生命週期
 *
 * 若元件在 SSR 期間有被建立起來則 CSR 期間不會再次執行
 * 若元件並沒有在 SSR 期間被建立的話則 CSR 期間就會被執行
 */
export function onServerClientOnce(fn) {
  const hook = async () => {
    if (import.meta.env.SSR || !_isHydration) {
      await fn(import.meta.env.SSR)
    }
  }
  onBeforeMount(hook)
  onServerPrefetch(hook)
}

/*
 * 必須在 vue component setup 期間掛載的生命週期
 *
 * CSR 的 hydration 階段才會執行
 * 此階段通常只會允許你將 hydrationStore 中的資料還原至對應位置
 * 還原過程必須保持同步執行
 * 任何非同步的行為在此生命週期內發生的話都有可能造成 hydration mismatch 發生
 */
export function onHydration(fn) {
  onBeforeMount(() => {
    if (_isHydration) {
      fn()
    }
  })
}
