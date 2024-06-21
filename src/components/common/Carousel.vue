<template>
  <div class="relative hidden md:block">
    <div class="mb-20 text-lg font-bold leading-lg">{{ label }}</div>
    <div
      class="h-[400px] w-full rounded-md bg-cover bg-center bg-no-repeat p-10"
      :style="{ backgroundImage: `url(${images[activeSlide].img})` }"
    ></div>
    <div class="absolute bottom-10 left-2/4 -translate-x-2/4 -translate-y-2/4 overflow-hidden">
      <ul class="flex justify-center space-x-10">
        <li
          class="h-6 w-6 cursor-pointer rounded-full bg-[#D9D9D9]"
          v-for="(item, i) in images"
          :class="{ 'bg-black': i === activeSlide }"
          @click="showSlide(i)"
          :key="i"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import ad_1 from '@/assets/images/ad_1.png'
import ad_2 from '@/assets/images/ad_2.png'
import ad_3 from '@/assets/images/ad_3.png'

const props = defineProps({
  intervalTime: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
})

const images = ref([{ img: ad_1 }, { img: ad_2 }, { img: ad_3 }])

const activeSlide = ref(0)

const showSlide = (n) => {
  activeSlide.value = n
  restart()
}

const showNext = () => {
  if (activeSlide.value <= images.value.length - 2) {
    activeSlide.value += 1
  } else if (activeSlide.value + 1 === images.value.length) {
    activeSlide.value = 0
  } else {
    activeSlide.value = images.value.length - 1
  }
  setupNext()
}

// const showPrev = () => {
//   if (activeSlide.value >= 1) {
//     activeSlide.value -= 1
//   } else if (activeSlide.value === 0) {
//     activeSlide.value = images.value.length - 1
//   } else {
//     activeSlide.value = 0
//   }
//   time = setTimeout(showNext, 3000)
// }

const setupNext = () => (setupNext.timerId = setTimeout(showNext, 3000))
const stop = () => clearTimeout(setupNext.timerId)
const restart = () => {
  if (props.intervalTime) {
    stop()
    setupNext()
  }
}

onMounted(restart)
onActivated(restart)
onBeforeUnmount(stop)
onDeactivated(stop)
</script>
