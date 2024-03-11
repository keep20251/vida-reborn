<script setup>
import { ref } from 'vue'
import AdvantagesContent from '@comp/official/AdvantagesContent.vue'

const advantages = ref([
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: false },
  { id: 4, active: false },
])

const contentClick = (id) => {
  advantages.value = advantages.value.map((advantage) => ({ ...advantage, active: advantage.id === id }))
}
</script>
<template>
  <div class="mx-auto my-80 grid grid-cols-1 sm:mx-auto sm:grid-cols-4">
    <AdvantagesContent
      v-for="advantage in advantages"
      :key="advantage.id"
      :id="advantage.id"
      :title="advantage.title"
      :subtitle="advantage.subtitle"
      :desc="advantage.desc"
      :active="advantage.active"
      @contentClick="contentClick"
    />
  </div>
</template>
<style lang="scss" scoped></style>
