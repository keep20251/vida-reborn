import cloneDeep from 'lodash/cloneDeep'

/**
 * 因為 Pinia 的 $reset 方法不支援 Vue Composition API，
 * 只支援 Options API
 * 所以自行實作 $reset() 方法
 * 再將 $reset() 方法掛載到 pinia 上
 */
export function resetStore({ store }) {
  const initialState = cloneDeep(store.$state)
  store.$reset = () => store.$patch(cloneDeep(initialState))
}
