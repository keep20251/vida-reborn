<template>
  <Page>
    <template #default>
      <div>
        <div class="p-16">
          <button class="h-48 rounded-xl bg-green-400 px-16 text-white" @click="addSize">Add Icon Size</button>
        </div>
        <div class="flex justify-center bg-slate-600 align-middle">
          <div class="my-32 grid grid-cols-6">
            <div v-for="icon in icons" :key="`icon-${icon}`" class="mb-16 flex flex-col">
              <Icon class="mx-auto" :name="icon" :shadow="true" :size="size" set="vida"></Icon>
              <div class="mx-auto">{{ icon }}</div>
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

const icons = []
Object.keys(iconMap).forEach((key) => {
  icons.push(key)
})

const size = ref(50)
function addSize() {
  size.value += 5
  if (size.value > 100) size.value = 20
}
</script>
