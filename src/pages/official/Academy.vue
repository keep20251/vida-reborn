<template>
  <div class="h-full w-full bg-primary">
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

    <div class="flex flex-col items-center justify-center px-24">
      <div class="flex w-full justify-start xl:w-[90%]">
        <div v-if="isDesktop" class="mt-50 flex flex-row items-center justify-center space-x-15">
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
      </div>
      <div class="flex flex-col-reverse justify-start pb-[150px] pt-50 md:flex-row">
        <div class="flex flex-col space-y-50">
          <div class="grid grid-cols-2 md:grid-cols-3">
            <AcademyVideo v-for="n in 6" :key="`video-${n}`" :id="n"></AcademyVideo>
          </div>
        </div>
        <div
          class="flex max-w-[553px] flex-col items-center justify-center space-y-20 text-start text-white md:ml-[120px]"
        >
          <div class="w-full text-start text-xl font-bold leading-7">{{ $t('official.academy.page.subtitle') }}</div>
          <div v-for="(content, index) in contents" :key="`content-${index}`" class="text-md font-normal leading-5">
            {{ $t(content) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
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
</script>
