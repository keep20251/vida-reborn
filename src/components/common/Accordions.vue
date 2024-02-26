<template>
  <ul>
    <li @click="onDropdownClick">Root</li>
    <div class="relative">
      <ul
        class="scrollbar duration-400 flex w-full flex-col overflow-auto bg-slate-300 transition-all"
        :class="[{ 'max-h-[500px]': open, 'max-h-0': !open }]"
      >
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
      </ul>
    </div>

    <!-- <transition name="slide">
      <ul v-if="isShow">
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
      </ul>
    </transition> -->
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'

const open = ref(false)
const openPosition = ref('bottom')
const optionStyle = computed(() => {
  switch (openPosition.value) {
    case 'bottom':
      return 'top-30 origin-top'
    case 'top':
      return 'bottom-30 origin-bottom'
    default:
      return 'top-30 origin-top'
  }
})

function onDropdownClick() {
  open.value = !open.value
}
</script>
<style>
/* .slide-enter-active,
.slide-leave-active {
  transition: 0.3s ease-in;
}
.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
} */
</style>
