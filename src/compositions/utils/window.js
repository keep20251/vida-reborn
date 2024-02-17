import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

export function useWindow() {
  const { isDesktop } = storeToRefs(useAppStore())

  function openWindow(url = '') {
    const { availWidth, availHeight } = window.screen
    const target = isDesktop.value ? 'newWindow' : '_blank'
    const option = isDesktop.value
      ? `width=${availWidth},height=${availHeight},scrollbars=yes,resizable=yes,toolbar=no,location=no,menubar=no,status=no`
      : ''
    return window.open(url, target, option)
  }

  return { openWindow }
}
