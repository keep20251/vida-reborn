import { computed, readonly, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { useEscapeClose } from '@/compositions/utils/escape-close'

export const useFullscreenPhotoStore = defineStore('fullscreen-photo', () => {
  const feed = shallowRef(null)
  const currIndex = ref(0)
  const isOpen = computed(() => feed.value !== null)

  const escapeKey = '__FULLSCREEN_PHOTO_DIALOG'
  const { push, remove } = useEscapeClose()

  function open(_feed, index = 0) {
    feed.value = _feed
    currIndex.value = index
    push({ key: escapeKey, target: feed, fn: close })
  }

  function close() {
    feed.value = null
    currIndex.value = 0
    remove(escapeKey)
  }

  return {
    feed: readonly(feed),
    currIndex,
    isOpen,

    open,
    close,
  }
})
