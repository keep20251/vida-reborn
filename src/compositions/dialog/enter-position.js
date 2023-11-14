import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { usePopupDialogStore } from '@/store/popup-dialog'

export function useEnterPosition() {
  let centerX
  let centerY

  const x = ref(0)
  const y = ref(0)

  const { isOpen } = storeToRefs(usePopupDialogStore())

  function update(event) {
    if (isOpen.value) return
    x.value = event.pageX - centerX
    y.value = event.pageY - centerY
  }

  function setCenterPosition() {
    centerX = Math.floor(window.innerWidth / 2)
    centerY = Math.floor(window.innerHeight / 2)
  }

  const debounceSetCenterPosition = useDebounceFn(setCenterPosition, 1000)

  onMounted(() => {
    // body 有點擊事件就更新點擊位置
    document.body.addEventListener('click', update, true)

    // RWD 切換時要修正 viewport 中心位置
    window.addEventListener('resize', debounceSetCenterPosition)
  })

  onUnmounted(() => {
    document.body.removeEventListener('click', update, true)
    window.removeEventListener('resize', debounceSetCenterPosition)
  })

  setCenterPosition()

  return { x, y }
}
