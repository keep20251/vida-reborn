<template>
  <div class="h-full w-full">
    <div
      v-if="isDesktop"
      class="relative h-full min-h-[280px] w-full bg-[url('@/assets/images/official/academy/header.png')] bg-[right_30%_bottom_10%] bg-no-repeat object-cover text-center"
    ></div>
    <div v-else class="relative">
      <img
        src="@/assets/images/official/academy/header-mobile.jpg?url"
        class="h-full w-full object-cover"
        alt="VIDA Academy"
      />
      <div class="absolute bottom-22 flex w-full flex-row items-center justify-center space-x-15">
        <img
          src="@/assets/images/official/logo-white.svg?url"
          class="h-34 w-60 object-cover sm:h-34 sm:w-60"
          alt="VIDA"
        />
        <img src="@/assets/images/official/vertical-divider.svg?url" class="object-cover" />
        <div class="align-bottom text-[34px] font-bold leading-[34px] text-white">
          {{ $t('official.academy.page.title') }}
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center bg-primary">
      <div class="flex flex-col-reverse px-16 pb-[150px] pt-50 md:flex-row">
        <div class="flex w-full flex-col space-y-50">
          <div v-if="isDesktop" class="flex flex-row items-center space-x-15">
            <img
              src="@/assets/images/official/logo-white.svg?url"
              class="h-40 w-71 object-cover sm:h-34 sm:w-60"
              alt="VIDA"
            />
            <img src="@/assets/images/official/vertical-divider.svg?url" class="object-cover" />
            <div class="align-bottom text-[40px] font-bold leading-[40px] text-white">
              {{ $t('official.academy.page.title') }}
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3">
            <AcademyVideo
              v-for="(video, index) in videos"
              :key="`video-${index}`"
              :id="video.value"
              :link="video.link"
              :border="selectedVideo === video.value"
              @click="selectedVideo = video.value"
            ></AcademyVideo>
          </div>
        </div>
        <div class="flex max-w-[553px] flex-col items-center justify-center space-y-20 text-start text-white">
          <div class="text-xl font-bold leading-7">{{ $t('official.academy.page.subtitle') }}</div>
          <div v-for="(content, index) in contents" :key="`content-${index}`" class="text-md font-normal leading-5">
            {{ $t(content) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import AcademyVideo from '@/components/official/AcademyVideo.vue'

const { isDesktop } = storeToRefs(useAppStore())

const contents = [
  'official.academy.page.content.1',
  'official.academy.page.content.2',
  'official.academy.page.content.3',
  'official.academy.page.content.4',
]

const selectedVideo = ref(null)
const videos = [
  {
    value: 1,
    link: 'https://www.youtube.com/watch?v=_569x7cWAFI',
  },
  {
    value: 2,
    link: 'https://www.youtube.com/watch?v=_x2TCxj4YyI',
  },
  {
    value: 3,
    link: 'https://www.youtube.com/watch?v=wwiwVvgcd9M',
  },
  {
    value: 4,
    link: 'https://www.youtube.com/watch?v=3PjcwD99z5s',
  },
  {
    value: 5,
    link: 'https://www.youtube.com/watch?v=XGKvT-28E6E',
  },
  {
    value: 6,
    link: 'https://www.youtube.com/watch?v=s7cP6Ft-WjA',
  },
]
</script>
