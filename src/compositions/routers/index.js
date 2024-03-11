import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'

export function useRouters() {
  const router = useRouter()
  const accountStore = useAccountStore()
  const { username: $username } = storeToRefs(accountStore)

  function back() {
    if (window.history.state.back === null) {
      return to('home')
    } else {
      router.back()
      return Promise.resolve()
    }
  }

  function to(name, { params, query } = {}, replace = false) {
    // mine 頁用 push 物件的方式導過去必須使用 child 的第一個名稱才會顯示出來
    // 感覺是 vue-router 的坑
    if (name === 'mine') {
      name = 'mine-home'
    }

    return router.push({ name, params, query, replace })
  }

  function replace(name, { params, query } = {}) {
    return to(name, { params, query }, true)
  }

  function toMessage(username) {
    if (username === $username.value) {
      console.warn('你確定你可以跟自己聊天？？')
      return
    }
    return to('message', { params: { to: username } })
  }

  function toCreator(username) {
    if (username === $username.value) {
      return to('mine')
    }
    return to('creator', { params: { username } })
  }

  function toFeed(username, feedId) {
    return to('feed', { params: { username, feedId } })
  }

  function updateParams({ params, query } = {}) {
    router.replace({ name: router.currentRoute.name, params, query })
  }

  return {
    back,
    to,
    replace,
    toMessage,
    toCreator,
    toFeed,
    updateParams,
  }
}
