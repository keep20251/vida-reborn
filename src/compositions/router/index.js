import { useRouter } from 'vue-router'

export function useRouters() {
  const router = useRouter()

  function toCreator(username) {
    router.push({ name: 'creator', params: { username } })
  }

  return {
    toCreator,
  }
}
