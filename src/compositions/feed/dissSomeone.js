import { useCreatorStore } from '@/store/creator'
import { useFeedStore } from '@/store/feed'
import { useModalStore } from '@/store/modal'
import useRequest from '@use/request'
import { BLOCK_ACTION, MODAL_TYPE } from '@const'

export function useDissSomeone(reportBlockUser) {
  const modalStore = useModalStore()
  const { open, alert } = modalStore

  const creatorStore = useCreatorStore()
  const { toggleBlock: toggleBlockInCreator } = creatorStore

  const feedStore = useFeedStore()
  const { toggleBlock: toggleBlockInFeed } = feedStore

  const { isLoading: isReportLoading, execute: execReport } = useRequest('User.report')
  function report() {
    if (isReportLoading.value) return

    const uuid = reportBlockUser.uuid
    open(MODAL_TYPE.REPORT, {
      title: 'label.report',
      size: 'lg',
      confirmAction: async (data) => {
        try {
          await execReport({ ...data, uuid })
          requestAnimationFrame(() => alert({ title: 'title.reportSuccess', content: data.reason }))
        } catch (e) {
          return e.message
        }
      },
      cancelAction: () => {},
    })
  }

  const { isLoading: isLoadingBlock, execute: execBlock } = useRequest('User.block')
  function block(isBlock) {
    if (isLoadingBlock.value) return

    const reqData = {
      aff_blocked: reportBlockUser.aff,
      action_type: isBlock ? BLOCK_ACTION.UNBLOCK : BLOCK_ACTION.BLOCK,
    }

    execBlock(reqData)
      .then(() => {
        toggleBlockInCreator(reportBlockUser.username, !isBlock)
        toggleBlockInFeed(reportBlockUser.aff, !isBlock)
      })
      .catch((e) => console.error(e))
  }

  return {
    report,
    block,
  }
}
