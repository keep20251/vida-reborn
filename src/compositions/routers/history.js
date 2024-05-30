import { computed, ref } from 'vue'

/**
 * 用於管理一些客製化的彈窗
 * 通常這類彈窗都會需要自行控制要顯示的組件
 * 以及前進後退的狀態
 * */
export function useHistory({ initValue }) {
  const now = ref(null)
  const history = ref([])

  init(initValue)

  function goto(value) {
    history.value.push(now.value)
    now.value = value
  }

  function back() {
    if (history.value.length <= 0) {
      throw new Error('History is empty, you should not call back()')
    }
    now.value = history.value.pop()
  }

  function init(value) {
    now.value = value
  }

  // 這裡使用 computed 是為了避免 hydrate 時的問題
  const historyProxy = computed(() => history.value)
  const nowProxy = computed(() => now.value)

  return { now: nowProxy, history: historyProxy, goto, back, init }
}
