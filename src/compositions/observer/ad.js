import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { trackEvent } from '@/gtm'
import { useAccountStore } from '@/store/account'
import { useAdultChecked } from '@use/utils/adultChecked'
import { USER_ROLE, POPUP_AD_DIALOG } from '@const'
import { useAdDialogStore } from '@/store/ad-dialog'

export const useAdObserver = () => {
  const { $openAdDialog } = useAdDialogStore()
  const accountStore = useAccountStore()
  const { isLogin, userData } = storeToRefs(accountStore)

  const opener = {
    openingAd: () => {
      trackEvent({ key: 49 })
      $openAdDialog(POPUP_AD_DIALOG.OPENING).open()
    },
  }

  function watchOpenAd() {
    const { adultChecked } = useAdultChecked()
    watch(adultChecked, (newValue) => {
      if (newValue) {
        if (isLogin.value) opener.openingAd()
      }
    })

    watch(
      isLogin,
      (newValue) => {
        if (!adultChecked.value) return
        if (newValue) {
          if (userData.value.role_id === USER_ROLE.GENERAL) opener.openingAd()
        }
      },
      { immediate: true },
    )
  }

  return {
    opener,
    watchOpenAd,
  }
}
