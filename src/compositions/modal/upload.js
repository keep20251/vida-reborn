import { ref } from 'vue'
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'
import uploadImage from '@/http/upload/uploadImage'

export function useDialog() {
  const { open, close } = useModalStore()

  async function uploadImageDialog(file, callback = null) {
    try {
      const progress = ref(0)
      open(MODAL_TYPE.PROGRESS, {
        size: 'sm',
        title: '上傳中',
        content: {
          progress: progress.value,
        },
        showClose: false,
        showConfirm: false,
      })
      const result = await uploadImage(file, (p) => (progress.value = p * 100))
      callback && callback(result)
      return result
    } catch (e) {
      console.error(e)
    } finally {
      close()
    }
  }

  return {
    uploadImageDialog,
  }
}
