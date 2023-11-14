import { usePopupDialogStore } from '@/store/popup-dialog'
import { usePopupMessageStore } from '@/store/popup-message'
import { useAccountStore } from '@/store/account'
import { useCreatorStore } from '@/store/creator'
import { usePayment } from '@/compositions/payment'
import { useAdObserver } from '@/compositions/observer/ad'
import { POPUP_DIALOG_TYPE, BLOCK_UPDATE, REWARD_TYPE, CONSUME_TYPE } from '@/constant'
import { MEDIA_TYPE } from '@/constant/publish'
import { $t } from '@/i18n'
import API from '@/http'
import { notifyBlock } from '@/utils/state-broadcast'
import { storeToRefs } from 'pinia'
import { trackEvent } from '@/gtm'
import BlockButton from '@/components/button/BlockButton.vue'

export function useDialog() {
  const { $popupDialog, $selection, $alert, close: closePopupDialog } = usePopupDialogStore()
  const { open } = usePopupMessageStore()
  const { getCreator } = useCreatorStore()
  const { pay, cancel } = usePayment()

  const accountStore = useAccountStore()
  const { userId } = storeToRefs(accountStore)

  const { opener } = useAdObserver()
  const { openingAd } = opener

  function donate(item, gtmKey, toMedia = false) {
    // 不能donate給自己
    if (item.author?.aff === userId.value) {
      $alert({
        content: $t('content.chat.canNotDonateToSelf'),
        confirm: () => {},
        showClose: false,
      }).open()
      return
    }

    $popupDialog(POPUP_DIALOG_TYPE.TIP, {
      image: item.author?.avatar,
      title: item.author?.nickname,
      content: item.author,
      confirm: async (data) => {
        const payload = {
          type: toMedia
            ? item.type === MEDIA_TYPE.VIDEO
              ? REWARD_TYPE.VIDEO
              : REWARD_TYPE.PHOTO
            : REWARD_TYPE.CREATOR,
          info_id: toMedia ? item.id : item.author.aff,
          aff: item.author.aff,
          amount: data.amount,
          message: data.message,
          // TODO 先不傳信用卡資訊
          // card_id: data.card_id,
        }
        const { uuid } = await getCreator(item.author.aff)
        await pay(API.Home.reward, payload, CONSUME_TYPE.REWARD, data.newWindow, uuid, data.amount)
      },
      confirmText: $t('common.send'),
    })
      .next(POPUP_DIALOG_TYPE.PROGRESS, {
        title: $t('payment.pending'),
        content: {
          indeterminate: true,
        },
        showClose: false,
        showConfirm: true,
        confirmText: $t('common.cancel'),
        confirm: async () => cancel(),
      })
      .open()

    gtmTrack(gtmKey, item)
  }

  function subscribe(item, gtmKey) {
    // 不能訂閱自己
    if (item.author?.aff === userId.value) {
      $alert({
        content: $t('content.subscribe.canNotSubToSelf'),
        confirm: () => {
          // TODO 先直接reload
          location.reload()
        },
        showClose: false,
      }).open()
      return
    }

    const buttonSlot = {
      component: BlockButton,
      props: {
        label: $t('label.openingBtn', { price: '9.99' }),
        'is-promotion': true,
      },
      callback: () => {
        closePopupDialog()
        openingAd()
      },
    }

    $popupDialog(POPUP_DIALOG_TYPE.SUBSCRIBE, {
      image: item.author?.avatar,
      title: $t('label.subscribe') + item.author?.nickname,
      content: item.author,
      confirm: async (data) => {
        const payload = {
          author_aff: item.author.aff,
          // TODO 先不傳信用卡資訊
          // card_id: data.cardId,
        }
        await pay(API.Home.subscribe, payload, CONSUME_TYPE.SUBSCRIBE, data.newWindow, null, item.author?.price)
      },
      confirmText: $t('label.subscribeBtn', { price: item.author?.price.toFixed(2) }),
      // buttonSlot,
    })
      .next(POPUP_DIALOG_TYPE.PROGRESS, {
        title: $t('payment.pending'),
        content: {
          indeterminate: true,
        },
        showClose: false,
        showConfirm: true,
        confirmText: $t('common.cancel'),
        confirm: async () => cancel(),
      })
      .open()

    gtmTrack(gtmKey, item)
  }

  function shopBuy(item) {
    // 不能買自己的商品
    if (item.author?.aff === userId.value) {
      $alert({
        content: $t('content.shopBuy.canNotBuyToSelf'),
        confirm: () => {
          // TODO 先直接reload
          location.reload()
        },
        showClose: false,
      }).open()
      return
    }

    $popupDialog(POPUP_DIALOG_TYPE.SHOP_BUY, {
      image: item.author?.avatar,
      title: $t('title.buyGoods'),
      content: item,
      confirm: async (data) => {
        const payload = {
          id: item.id,
          // TODO 先不傳信用卡資訊
          // card_id: data.cardId,
        }
        await pay(API.Home.shopBuy, payload, CONSUME_TYPE.SHOP_BUY, data.newWindow, null, item?.money)
      },
      confirmText: $t('label.shopBuyBtn', { price: item?.money.toFixed(2) }),
    })
      .next(POPUP_DIALOG_TYPE.PROGRESS, {
        title: $t('payment.pending'),
        content: {
          indeterminate: true,
        },
        showClose: false,
        showConfirm: true,
        confirmText: $t('common.cancel'),
        confirm: async () => cancel(),
      })
      .open()

    gtmTrack(26, item)
  }

  async function more(aff, id) {
    const creator = await getCreator(aff)
    const isBlock = creator.is_block
    const type = isBlock ? BLOCK_UPDATE.CANCEL_BLOCK : BLOCK_UPDATE.ADD_BLOCK
    const blockMsg = {
      title: isBlock ? $t('common.unblock') : $t('common.block'),
      success: isBlock ? $t('common.hasUnblocked') : $t('common.hasBlocked'),
      fail: isBlock ? $t('common.unblockFail') : $t('common.blockFail'),
    }

    $selection([$t('common.report'), blockMsg.title], {
      confirm: async (selected) => {
        if (selected === 1) {
          // console.log('媽啊他按了封鎖而且封鎖沒有下一個popup dialog跳出我只能在這邊做事情捏')
          try {
            await API.Block.update({
              data: {
                type,
                aff_blocked: aff,
              },
            })

            notifyBlock(aff, !isBlock)

            const { nickname } = await getCreator(aff)
            open(blockMsg.success + nickname)
          } catch (e) {
            open(blockMsg.fail)
            throw e
          }
        }
      },
    })
      .next([
        {
          type: POPUP_DIALOG_TYPE.ACCUSE,
          title: $t('common.report'),
          confirm: async (d) => {
            const data = {
              reported_aff: aff,
              report_reason: d.reason,
              report_content: d.content,
            }
            if (id) {
              data.info_id = id
            }

            try {
              await API.Home.report({ data })
              open($t('common.reportSuccess'))
            } catch (e) {
              open($t('common.reportFail'))
              throw e
            }
          },
          confirmText: $t('common.report'),
          cancel() {},
        },
        // {
        //   type: POPUP_DIALOG_TYPE.CONFIRM,
        //   title: '封鎖他',
        //   content: '你確定再也不想看到他？',
        //   confirm: () => {},
        //   cancel: () => {},
        // },
      ])
      .open()
  }

  function gtmTrack(key, item) {
    const meta = { aff: item.author.aff }
    if (item.id) {
      meta.id = item.id
    }
    trackEvent({ key, meta })
  }

  return {
    donate,
    subscribe,
    shopBuy,
    more,
  }
}
