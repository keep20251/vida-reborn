import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { useModalStore } from '@/store/modal'
import { usePublishStore } from '@/store/publish'
import { useRouters } from '@use/routers'
import { navHomeAgain } from '@/utils/nav-again'

export function useNavigator() {
  const route = useRoute()
  const atHome = computed(() => route.name === 'home')
  const atSearch = computed(() => route.name === 'search')
  const atMessage = computed(() => route.name === 'message')
  const atMine = computed(() => route.name.includes('mine'))

  const { to } = useRouters()

  const accountStore = useAccountStore()
  const { isCreator } = storeToRefs(accountStore)
  const { afterLoginAction } = accountStore
  const { fileSelectDialog } = storeToRefs(useDialogStore())
  const { confirm } = useModalStore()

  const toMessage = afterLoginAction(() => to('message'))

  const publishStore = usePublishStore()
  const { isEditing } = storeToRefs(publishStore)
  const onPublishClick = afterLoginAction(() => {
    if (!isCreator.value) {
      confirm({
        title: 'title.beCreatorFirst',
        confirmAction: () => to('mine').then(() => to('mine-creator-agreement')), // 想到 mine 子層不先到 mine 會被卡在 mine 下不去
      })
    } else if (isEditing.value) {
      to('publish')
    } else {
      fileSelectDialog.value = true
    }
  })

  function checkHomeAgain() {
    if (atHome.value) {
      navHomeAgain()
    }
  }

  return {
    atHome,
    atSearch,
    atMessage,
    atMine,

    toMessage,
    onPublishClick,

    checkHomeAgain,
  }
}
