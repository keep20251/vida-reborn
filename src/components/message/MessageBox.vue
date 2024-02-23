<template>
  <div :class="style" ref="root">
    <p v-if="isText" class="grow whitespace-pre-wrap text-justify" :style="{ 'word-break': 'break-word' }">
      {{ item.content }}
    </p>
    <div v-if="isText" class="shrink-0 self-end text-sm" :class="{ 'text-white': item.self, 'text-black': !item.self }">
      {{
        item.status === SEND_STATUS.SUCCESS
          ? toDateTimeString(new Date(item.timestamp)).substring(11, 16)
          : item.status === SEND_STATUS.SENDING
            ? $t('message.sending')
            : $t('message.failure')
      }}
    </div>
    <div v-if="isPhoto" class="relative z-10" :class="{ 'h-[150px] w-[300px]': item.status === SEND_STATUS.SENDING }">
      <EncryptImage :src="photoUrl" :border-radius="24" cover></EncryptImage>
      <div
        class="absolute bottom-10 right-10 shrink-0 self-end text-sm"
        :class="{ 'text-white': item.self, 'text-black': !item.self }"
      >
        {{
          item.status === SEND_STATUS.SUCCESS
            ? toDateTimeString(new Date(item.timestamp)).substring(11, 16)
            : item.status === SEND_STATUS.SENDING
              ? $t('message.sending')
              : $t('message.failure')
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { SEND_STATUS } from '@const/chat'
import { toDateTimeString } from '@/utils/string-helper'

const props = defineProps({
  item: { type: Object, requried: true },
})
const emits = defineEmits(['intersect'])

const style = computed(() => {
  const main = props.item.self
    ? 'relative mr-8 flex max-w-[80%] space-x-8 self-end rounded-3xl bg-primary text-base leading-lg text-white before:absolute before:-right-2 before:bottom-0 before:h-16 before:rounded-bl-lg before:border-r-[1rem] before:border-solid before:border-r-primary after:absolute after:-right-9 after:bottom-0 after:h-16 after:w-10 after:rounded-bl-md after:bg-white md:mr-24 md:max-w-[65%]'
    : 'relative flex max-w-[80%] space-x-8 self-start rounded-3xl bg-gray-f6 text-base leading-lg text-black before:absolute before:-left-2 before:bottom-0 before:h-16 before:rounded-br-lg before:border-l-[1rem] before:border-solid before:border-l-gray-f6 after:absolute after:-left-8 after:bottom-0 after:h-16 after:w-10 after:rounded-br-md after:bg-white md:max-w-[65%]'
  const padding = isText.value ? 'px-16 py-10' : isPhoto.value ? 'p-5' : ''

  return `${main} ${padding}`
})

const { appConfig } = useAppStore()
const { img_url: imgHost } = appConfig.config
const isText = computed(() => props.item.contentType === 'text')
const isPhoto = computed(() => props.item.contentType === 'photos')
const photoUrl = computed(() => (isPhoto.value ? `${imgHost}${props.item.content}` : ''))

const root = ref(null)
let observer
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          emits('intersect')
          observer.unobserve(root.value)
        }
      })
    },
    {
      root: root.value.parentNode,
      threshold: 0.95,
    },
  )
  observer.observe(root.value)
})
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
