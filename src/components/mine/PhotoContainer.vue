<template>
  <div class="flex w-full flex-col space-y-20">
    <div class="flex w-full flex-col space-y-10">
      <div class="text-base font-normal leading-md">{{ props.title }}</div>
      <div
        class="border-sm flex min-h-[12.5rem] items-center justify-center rounded-md border-gray-f6 bg-gray-f6"
        :class="{ 'border-warning': !!errMsg }"
      >
        <img
          v-if="captureUrl"
          class="flex min-h-[12.5rem] items-center justify-center rounded-md"
          :src="captureUrl"
          :alt="props.pictureInfo"
        />
        <div v-else>{{ props.pictureInfo }}</div>
      </div>
    </div>
    <div class="flex flex-col space-y-8">
      <Button contrast @click="onCapture">{{ props.buttonText }}</Button>
      <div v-if="errMsg" class="text-sm font-normal leading-3 text-warning">{{ $t(errMsg) }}</div>
    </div>

    <input
      type="file"
      capture="camera"
      accept="image/jpg, image/jpeg, image/png, image/gif"
      hidden
      ref="inputCapture"
      @change="(e) => emit('change:file', e.target.files[0])"
    />
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'
import { transBlobToUrl } from '@/utils/transform'

const emit = defineEmits(['change:file'])
const props = defineProps({
  title: { type: String, required: true },
  pictureInfo: { type: String, required: true },
  buttonText: { type: String, required: true },
  errMsg: { type: String, default: '' },
})

const inputCapture = ref(null)
const { isMobile } = useAppStore()

const { open } = useModalStore()

const captureData = ref(null)
const captureUrl = computed(() => {
  return captureData.value ? transBlobToUrl(captureData.value) : null
})

function onCapture() {
  if (isMobile.value) {
    inputCapture.value.click()
  } else {
    open(MODAL_TYPE.PHOTO_CAPTURE, {
      size: 'lg',
      title: '拍攝照片',
      confirmText: '拍攝',
      confirmAction: (data) => {
        captureData.value = data
        emit('change:file', data)
      },
      content: {},
      showClose: true,
      showConfirm: false,
    })
  }
}
</script>
