import { usePopupMessageStore } from '@/store/popup-message'

export function useCopyToClipboard() {
  const { open: openMessage } = usePopupMessageStore()

  function copy(value) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          openMessage('copy.link')
          console.log('Text copied to clipboard...', value)
        })
        .catch((e) => {
          console.warn('Something went wrong', e)
          openMessage('copy.fail')
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
        openMessage('copy.link')
      } catch (error) {
        console.error("document.execCommand('copy')發生錯誤", error)
        openMessage('copy.fail')
      } finally {
        textArea.remove()
      }
    }
  }

  return { copy }
}
