<template>
  <Page>
    <template #default>
      <div class="mt-32 w-full p-8">
        <div class="flex flex-col justify-center gap-4 align-middle">
          <div class="flex justify-center text-xl font-bold text-red-600">Store Counter: {{ counter }}</div>
          <div class="flex justify-center align-middle">
            <button class="rounded-md bg-green-500 px-8 py-1" @click="increment">Increment</button>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/store/counter'
import { onHydration, onServerClientOnce } from '@use/lifecycle'

const counterStore = useCounterStore()
const { counter } = storeToRefs(counterStore)
const { increment } = counterStore

onServerClientOnce(() => {
  const l = new Date().getSeconds()
  for (let i = 0; i < l; i++) {
    increment()
  }
})

onHydration(() => {
  console.log('這邊前端第一次拿到的時候進入 hydration 階段')
})
</script>
