<template>
  <Page>
    <template #default>
      <div>
        <div class="p-16">
          <button class="px-16 text-white bg-green-400 rounded-xl h-48" @click="addSize">Add Icon Size</button>
        </div>
        <div class="flex justify-center align-middle bg-slate-600">
          <div class="my-32 grid grid-cols-6">
            <div v-for="icon in icons" :key="`icon-${icon}`" class="flex flex-col mb-16">
              <Icon class="mx-auto" :name="icon" :shadow="true" :size="size"></Icon>
              <div class="mx-auto">{{ icon }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { IconSet } from '@/constant'
import Icon from '@/components/common/Icon.vue'
import Page from '@/components/layout/Page.vue'
import { ref } from 'vue'

const { fantasi: fantasiIcon } = IconSet

const icons = []
Object.keys(fantasiIcon).forEach((key) => {
  icons.push(key)
})

const size = ref(50)
function addSize() {
  size.value += 5
  if (size.value > 100) size.value = 20
}
</script>
