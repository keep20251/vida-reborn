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
import { useCounterStore } from '@/store/counter'
import { storeToRefs } from 'pinia'
import Page from '@/components/layout/Page.vue'

const counterStore = useCounterStore()
const { counter } = storeToRefs(counterStore)
const { increment } = counterStore
</script>
