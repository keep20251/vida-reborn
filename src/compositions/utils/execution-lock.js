import { ref } from 'vue'

/** 提供一個函式的執行鎖 */
export function useExecutionLock() {
  const disabled = ref(false)

  /**
   * 執行函式，執行期間會鎖住
   * @param {Function} fn
   */
  async function onExecute(fn) {
    disabled.value = true
    await fn()
    disabled.value = false
  }

  return { disabled, onExecute }
}
