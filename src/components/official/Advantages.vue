<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import AdvantagesContent from '@comp/official/AdvantagesContent.vue'

const { isMobile } = storeToRefs(useAppStore())

const advantages = ref([
  { id: 1, active: false },
  { id: 2, active: false },
  { id: 3, active: false },
  { id: 4, active: false },
])

const contentClick = (id) => {
  advantages.value = advantages.value.map((advantage) => ({ ...advantage, active: advantage.id === id }))
}

const option = {
  threshold: 1,
  rootMargin: '-225px 0px -225px 0px',
}
const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.background = '#6567e8'
      entry.target.style.color = 'white'
    } else {
      entry.target.style.background = 'white'
      entry.target.style.color = 'black'
    }
  })
}

let observer
onMounted(() => {
  if (isMobile.value) {
    observer = new IntersectionObserver(callback, option)
    const boxes = document.querySelectorAll('.official-advantages-content')
    boxes.forEach((box) => observer.observe(box))
  }
})
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
<template>
  <div class="mx-auto my-80 grid grid-cols-1 sm:mx-auto sm:grid-cols-2 md:grid-cols-4">
    <AdvantagesContent
      v-for="advantage in advantages"
      :key="advantage.id"
      :id="advantage.id"
      :active="advantage.active"
      @contentClick="contentClick"
    />
  </div>
</template>
<style lang="scss" scoped></style>
