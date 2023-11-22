<template>
  <Page>
    <template #default>
      <div class="mt-32 p-8 w-full">
        <div class="flex flex-col gap-4 justify-center align-middle">
          <div class="text-xl font-bold text-red-600 flex justify-center">Store Counter: {{ counter }}</div>
          <div class="flex justify-center align-middle">
            <button class="px-8 py-1 rounded-md bg-green-500" @click="increment">Increment</button>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { useCounterStore } from '@/store/counter'
import { storeToRefs } from 'pinia'
import Page from '@/components/layout/Page.vue'

const counterStore = useCounterStore()
const { counter } = storeToRefs(counterStore)
const { increment } = counterStore
</script>
