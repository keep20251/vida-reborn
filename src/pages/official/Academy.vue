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
        <div class="align-bottom text-[34px] font-bold leading-[34px] text-white">VIDA ACADAMY</div>
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
            <div class="align-bottom text-[40px] font-bold leading-[40px] text-white">VIDA ACADAMY</div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3">
            <AcademyVideo
              v-for="(video, index) in videos"
              :key="`video-${index}`"
              :title="video.title"
              :border="selectedVideo === video.value"
              @click="selectedVideo = video.value"
            ></AcademyVideo>
          </div>
        </div>
        <div class="flex max-w-[553px] flex-col items-center justify-center space-y-20 text-start text-white">
          <div class="text-xl font-bold leading-7">Join Vida, explore your potentials, earn more.</div>
          <div v-for="(content, index) in contents" :key="`content-${index}`" class="text-md font-normal leading-5">
            {{ content }}
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
  'Vida is a meticulously crafted member subscription platform designed exclusively for creators.It encourages creators to engage with their fansand monetize their content effectively.We provide a comprehensive suite of services centered around creators,including "crowdfunding" and "Strategic Branding Consultation.',
  'Additionally, we offer diverse membership tiers and versatile module options, empowering creators to express themselves freely.',
  'Currently, we proudly serve a community of over 5000 creators and fans, spanning 20+ countries. As we inspire creators to pursue excellence and produce high-quality content,',
  'Vida is equally committed to forging stronger connections between creators and their devoted fan base, fostering a profound sense of community unity.',
]

const selectedVideo = ref(null)
const videos = [
  { value: 0, title: 'Join Vida, explore your potentials, earn more.' },
  { value: 1, title: 'Managing your profit | Pro Tips for Growth ⬆' },
  { value: 2, title: 'How to tailor your subscription price | Real Tea Talk' },
  { value: 3, title: 'Connecting with your followers | Pure Gold💰' },
  { value: 4, title: 'Boosting your vida account on social media | Practical Advice' },
  { value: 5, title: 'Unlocking the Secrets of Exceptional Content Creation 💡🎥 | Source for Invaluable Insights' },
]
</script>
