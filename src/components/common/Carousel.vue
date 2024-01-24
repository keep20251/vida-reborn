<template>
  <div class="relative hidden md:block">
    <div class="mb-20 text-lg font-bold leading-lg">{{ label }}</div>
    <div
      class="h-[400px] w-full rounded-md bg-cover bg-center bg-no-repeat p-10"
      :style="{ backgroundImage: `url(${images[activeSlide].img})` }"
    ></div>
    <div class="absolute bottom-[10px] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden">
      <ul class="flex justify-center space-x-10">
        <li
          class="h-6 w-6 cursor-pointer rounded-full bg-[#D9D9D9]"
          v-for="(item, i) in images"
          :class="{ 'bg-black': getActiveSlide(i) }"
          @click="showSlide(i)"
          :key="i"
        ></li>
      </ul>
    </div>
    <div v-if="navigator" class="absolute top-[50%] flex w-full justify-between px-10">
      <button
        class="cursor-poimages.value-center flex h-25 w-25 justify-around rounded-full bg-[#ffffffb8] shadow-[0_0_3px_0_rgba(0,0,0,0.3)] outline-none"
        @click="showPrev"
      >
        <Icon name="back" size="16"></Icon>
      </button>
      <button
        class="cursor-poimages.value-center flex h-25 w-25 rotate-180 justify-around rounded-full bg-[#ffffffb8] shadow-[0_0_3px_0_rgba(0,0,0,0.3)] outline-none"
        @click="showNext"
      >
        <Icon name="back" size="16"></Icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'

const props = defineProps({
  intervalTime: {
    type: Boolean,
    default: false,
  },
  navigator: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'VIDA 活動與廣告',
  },
})

const images = ref([
  { img: 'https://i.postimg.cc/3RTHR6kh/4edca499dd436a67fa25e5fbf3cb5582.png' },
  { img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
  { img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg' },
  { img: 'https://images.pexels.com/photos/3054570/pexels-photo-3054570.jpeg' },
  { img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg' },
  { img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg' },
])

const activeSlide = ref(0)
let time

const showSlide = (n) => {
  activeSlide.value = n
  restartInterval()
}

const showNext = () => {
  if (activeSlide.value <= images.value.length - 2) {
    activeSlide.value += 1
  } else if (activeSlide.value + 1 === images.value.length) {
    activeSlide.value = 0
  } else {
    activeSlide.value = images.value.length - 1
  }
  restartInterval()
}

const showPrev = () => {
  if (activeSlide.value >= 1) {
    activeSlide.value -= 1
  } else if (activeSlide.value === 0) {
    activeSlide.value = images.value.length - 1
  } else {
    activeSlide.value = 0
  }
  restartInterval()
}

const getActiveSlide = (i) => i === activeSlide.value

onMounted(() => {
  restartInterval()
})

onActivated(() => {
  restartInterval()
})

onBeforeUnmount(() => {
  clearInterval(time)
})

onDeactivated(() => {
  clearInterval(time)
})

const restartInterval = () => {
  clearInterval(time)
  if (props.intervalTime) {
    time = setInterval(() => {
      showNext()
    }, 3000)
  }
}
</script>
