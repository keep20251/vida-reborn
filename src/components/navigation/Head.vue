<template>
  <div class="flex h-full w-full items-center justify-center" :class="{ 'border-b': divider }">
    <div class="flex cursor-pointer" @click="onBack">
      <Icon name="back" size="20"></Icon>
    </div>
    <div class="flex-grow text-center text-lg font-bold">
      {{ title }}
    </div>
    <div v-if="featureIcon" class="flex cursor-pointer" @click="$emit('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import { useRouters } from '@use/routers'

defineProps({
  title: { type: String },
  featureIcon: { type: String },
  divider: { type: Boolean, default: false },
})

const emits = defineEmits(['back', 'feature'])

const { back } = useRouters()
function onBack() {
  back().then(() => emits('back'))
}
</script>
