<template>
  <div>
    <div class="text-3xl font-bold underline text-blue-300 whitespace-nowrap">
      Hello <span class="text-3xl text-green-500">Vite</span>
    </div>
    <div class="text-xl font-bold text-red-600">Counter: {{ counter }}</div>
    <div>
      <button class="p-4 bg-slate-600 flex justify-center align-middle" @click="increment">Add</button>
    </div>
  </div>
</template>
<script setup>
import { useCounterStore } from '@/store/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { counter } = storeToRefs(counterStore)
const { increment } = counterStore
</script>
