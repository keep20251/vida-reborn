<template>
  <div class="mr-10 mt-10 flex select-none flex-col space-y-10" @click="onClick">
    <div
      class="max-h-[155px] min-h-[101px] min-w-[168px] max-w-[255px] cursor-pointer rounded-md border-[5px] border-primary hover:rounded-lg hover:border-white"
    >
      <img
        :src="`https://img.youtube.com/vi/${videoImg}/maxresdefault.jpg`"
        class="h-full w-full rounded-md object-cover"
        alt="Academy Video"
      />
    </div>
    <div class="max-w-[264px] text-md font-bold leading-5 text-white">
      {{ $t(`official.academy.page.videos.${props.id}`) }}
    </div>
    <BaseDialog v-if="dialog" size="auto" @click:around="dialog = false">
      <template #default>
        <div class="relative flex flex-col items-center justify-center">
          <div class="absolute right-0 top-0 cursor-pointer" @click="dialog = false">
            <Icon name="close" size="15"></Icon>
          </div>
          <div class="pt-32">
            <iframe
              :width="isMobile ? 256 : 960"
              :height="isMobile ? 144 : 540"
              :src="videoSrc"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const dialog = ref(false)

const { isMobile } = storeToRefs(useAppStore())

function onClick() {
  dialog.value = true
}

const videos = [
  { src: 'https://www.youtube.com/embed/_569x7cWAFI?si=5wbqs0P6mPEi5GJP', vid: '_569x7cWAFI', id: 1 },
  { src: 'https://www.youtube.com/embed/_x2TCxj4YyI?si=prQMfbSqdCjpTfzt', vid: '_x2TCxj4YyI', id: 2 },
  { src: 'https://www.youtube.com/embed/wwiwVvgcd9M?si=_JMW8ogDqUHmiVK6', vid: 'wwiwVvgcd9M', id: 3 },
  { src: 'https://www.youtube.com/embed/3PjcwD99z5s?si=NwrgDEW-CIHORR5l', vid: '3PjcwD99z5s', id: 4 },
  { src: 'https://www.youtube.com/embed/XGKvT-28E6E?si=vwUWsa7WVaJhpft4', vid: 'XGKvT-28E6E', id: 5 },
  { src: 'https://www.youtube.com/embed/s7cP6Ft-WjA?si=tjvuWC8vAyn660iY', vid: 's7cP6Ft-WjA', id: 6 },
]

const videoSrc = computed(() => videos.find((video) => video.id === props.id).src)
const videoImg = computed(() => videos.find((video) => video.id === props.id).vid)
</script>
