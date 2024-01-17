import { useI18n } from 'vue-i18n'
import { usePopupMessageStore } from '@/store/popup-message'

export function useCopyToClipboard() {
  const { t: $t } = useI18n()
  const { open: openMessage } = usePopupMessageStore()

  function copy(value) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          openMessage($t('copy.link'))
          console.log('Text copied to clipboard...', value)
        })
        .catch((e) => {
          console.warn('Something went wrong', e)
          openMessage($t('copy.fail'))
        })
    } else {
      console.warn("目前無法使用 navigator.clipboard，改用替帶方案 document.execCommand('copy')", value)

      const textArea = document.createElement('textarea')
      textArea.value = value
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'

      document.body.prepend(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        openMessage($t('copy.link'))
      } catch (error) {
        console.error("document.execCommand('copy')發生錯誤", error)
        openMessage($t('copy.fail'))
      } finally {
        textArea.remove()
      }
    }
  }

  return { copy }
}
