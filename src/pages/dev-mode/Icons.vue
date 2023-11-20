<template>
  <div class="flex justify-center align-middle bg-slate-600">
    <div class="my-32 grid grid-cols-6">
      <div v-for="icon in icons" :key="`icon-${icon}`" class="flex flex-col mb-16">
        <Icon class="mx-auto w-50 h-50" :name="icon" :shadow="true"></Icon>
        <div class="mx-auto">{{ icon }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IconSet } from '@/constant'
import Icon from '@/components/common/Icon.vue'

const { fantasi: fantasiIcon } = IconSet

const icons = []
Object.keys(fantasiIcon).forEach((key) => {
  icons.push(key)
})
</script>
