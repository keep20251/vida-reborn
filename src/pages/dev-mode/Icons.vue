<template>
  <div class="flex justify-center align-middle bg-slate-600">
    <div class="w-full h-full grid grid-cols-12">
      <div v-for="icon in icons" :key="`icon-${icon}`">
        <Icon :name="icon" size="32"></Icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IconSet } from '@/constant'
import Icon from '@/components/common/Icon.vue'

const { fantasi: fantasiIcon } = IconSet

const icons = []
Object.entries(fantasiIcon).forEach(([key, value]) => {
  icons.push(key)
})
console.log(`IconSet`, icons)
</script>
