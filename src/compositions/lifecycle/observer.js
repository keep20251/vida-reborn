import md5 from 'md5'
import { reactive, watch } from 'vue'

/**
 * 用於觀察Ref物件的變化，當物件變化時執行訂閱的函式
 * @param {Ref} objRef
 * @returns
 */
export function useObserver(objRef) {
  const functionMap = reactive(new Map())

  /**
   * @param {Function} fn.onExecuted 訂閱後觸發時應執行的函式，必傳
   * @param {Function} fn.onComplted 執行完成後的 callback
   * @param {Function} fn.onError 執行失敗後的 callback
   */
  function subscribe(fn = { onExecuted: null, onComplted: null, onError: null }) {
    if (!fn.onExecuted) throw new Error('onExecuted is required')
    functionMap.set(md5(fn), fn)
  }

  /**
   * 取消訂閱
   * @param {Object} fn
   */
  function unsubscribe(fn) {
    functionMap.delete(md5(fn))
  }

  watch(objRef, async (newValue, oldValue) => {
    if (newValue !== oldValue)
      await functionMap.forEach(async ({ onExecuted, onComplted, onError }) => {
        try {
          await onExecuted()
          onComplted && (await onComplted())
        } catch (e) {
          console.error(e)
          onError && (await onError(e))
        }
      })
  })

  return {
    subscribe,
    unsubscribe,
  }
}
