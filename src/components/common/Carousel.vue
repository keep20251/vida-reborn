<template>
  <div class="relative hidden md:block">
    <div
      class="h-[250px] w-full rounded-md bg-cover bg-center bg-no-repeat p-10 transition-all duration-300 ease-in-out"
      :style="{ backgroundImage: `url(${props.items[activeSlide].img})` }"
    ></div>
    <div class="absolute bottom-[10px] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden" ref="wrapper">
      <ul class="flex justify-center gap-x-8" :style="{ left: left + 'px' }" ref="slider">
        <li
          class="h-10 w-10 cursor-pointer rounded-full bg-gray36 shadow-[0_0_3px_0_rgba(0,0,0,0.25)]"
          v-for="(item, i) in props.items"
          :class="{ 'bg-[#fffbfb]': getActiveSlide(i) }"
          @click="showSlide(i)"
          :key="i"
        ></li>
      </ul>
    </div>
    <div class="absolute top-[50%] flex w-full justify-between px-10">
      <button
        class="flex h-25 w-25 cursor-pointer items-center justify-around rounded-full bg-[#ffffffb8] shadow-[0_0_3px_0_rgba(0,0,0,0.3)] outline-none"
        @click="showPrev"
      >
        <Icon name="back" :size="16"></Icon>
      </button>
      <button
        class="flex h-25 w-25 rotate-180 cursor-pointer items-center justify-around rounded-full bg-[#ffffffb8] shadow-[0_0_3px_0_rgba(0,0,0,0.3)] outline-none"
        @click="showNext"
      >
        <Icon name="back" :size="16"></Icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  intervalTime: {
    type: Boolean,
    default: false,
  },
})

const activeSlide = ref(0)
const left = ref(0)
let time

const showSlide = (n) => {
  activeSlide.value = n
}

const showNext = () => {
  console.log(activeSlide.value)
  if (activeSlide.value <= props.items.length - 2) {
    activeSlide.value += 1
  } else if (activeSlide.value + 1 === props.items.length) {
    activeSlide.value = 0
  } else {
    activeSlide.value = props.items.length - 1
  }
}

const showPrev = () => {
  console.log(activeSlide.value)
  if (activeSlide.value >= 1) {
    activeSlide.value -= 1
  } else if (activeSlide.value === 0) {
    activeSlide.value = props.items.length - 1
  } else {
    activeSlide.value = 0
  }
}

const getActiveSlide = (i) => i === activeSlide.value

onMounted(() => {
  if (props.intervalTime) {
    time = setInterval(() => {
      showNext()
    }, 5000)
  }
})

onBeforeUnmount(() => {
  clearInterval(time)
})
</script>
