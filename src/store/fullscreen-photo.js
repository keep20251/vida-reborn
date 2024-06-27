import { computed, readonly, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

export const useFullscreenPhotoStore = defineStore('fullscreen-photo', () => {
  const feed = shallowRef(null)
  const currIndex = ref(0)
  const isOpen = computed(() => feed.value !== null)

  function open(_feed, index = 0) {
    feed.value = _feed
    currIndex.value = index
  }

  function close() {
    feed.value = null
    currIndex.value = 0
  }

  return {
    feed: readonly(feed),
    currIndex,
    isOpen,

    open,
    close,
  }
})
