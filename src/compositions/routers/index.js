import { useRouter } from 'vue-router'

export function useRouters() {
  const router = useRouter()

  function back() {
    if (window.history.state.back === null) {
      return to('home')
    } else {
      router.back()
      return Promise.resolve()
    }
  }

  function to(name, { params, query } = {}) {
    return router.push({ name, params, query })
  }

  function toCreator(username) {
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
    toCreator,
    toFeed,
    updateParams,
  }
}
