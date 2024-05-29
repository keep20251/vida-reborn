<template>
  <div class="flex flex-col space-y-5">
    <button class="rounded-md bg-primary px-8 py-2 text-white" @click="() => (cardAlreadyExist = !cardAlreadyExist)">
      Switch
    </button>
    <keep-alive>
      <component :is="activeComponent"></component>
    </keep-alive>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import AddCard from './AddCard.vue'
import CardList from './CardList.vue'

const cardAlreadyExist = ref(true)
const activeComponent = computed(() => (cardAlreadyExist.value ? CardList : AddCard))
</script>
