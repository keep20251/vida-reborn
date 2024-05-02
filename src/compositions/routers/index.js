import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useCreatorStore } from '@/store/creator'
import { useModalStore } from '@/store/modal'

export function useRouters() {
  const router = useRouter()
  const accountStore = useAccountStore()
  const { username: $username } = storeToRefs(accountStore)

  const creatorStore = useCreatorStore()
  const { get: getCreator } = creatorStore

  const { alert } = useModalStore()

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

  async function toMessage(username) {
    if (username === $username.value) {
      console.warn('你確定你可以跟自己聊天？？')
      return
    }

    const creator = await getCreator(username)
    if (!creator.is_able_send_message) {
      alert({ title: 'info.subscribeBeforeChat' })
      return Promise.resolve()
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

  function reload() {
    if (!import.meta.env.SSR) {
      window.location.href = window.location.origin + '/home'
    }
  }

  return {
    back,
    to,
    replace,
    toMessage,
    toCreator,
    toFeed,
    updateParams,
    reload,
  }
}
