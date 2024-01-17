<template>
  <Page>
    <template #default>
      <div>
        <div class="p-16">
          <button class="h-48 rounded-xl bg-green-400 px-16 text-white" @click="addSize">Add Icon Size</button>
        </div>
        <div class="bg-slate-600 p-24">
          <div v-for="category in Object.keys(icons)" :key="category" class="flex flex-col">
            <div class="mb-24 text-center text-xl text-white">{{ category }}</div>
            <div class="mb-48 grid grid-cols-4 gap-16">
              <div v-for="icon in icons[category]" :key="`icon-${icon}`" class="mb-16 flex flex-col gap-8">
                <Icon class="mx-auto" :name="icon" :shadow="true" :size="size" set="vida"></Icon>
                <div class="text-center text-white">{{ icon }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import { iconMap } from '@/constant/icon-map'

const icons = Object.entries(iconMap).reduce((acc, [key, value]) => {
  const [category] = value.split('/')
  if (!acc[category]) {
    acc[category] = []
  }
  acc[category].push(key)
  return acc
}, {})

const size = ref(50)
function addSize() {
  size.value += 5
  if (size.value > 100) size.value = 20
}
</script>
