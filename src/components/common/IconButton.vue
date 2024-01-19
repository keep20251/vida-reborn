<template>
  <button class="rounded-full border border-black py-8 text-center" @click="() => emits('click')">
    <div class="flex flex-row items-center justify-center">
      <Icon :name="props.icon" :size="props.size" class="mr-10"></Icon>
      {{ $t(props.label) }}
    </div>
  </button>
</template>
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'apple',
  },
  iconSize: {
    type: String,
    default: '15',
  },
  label: {
    type: String,
    default: 'info.loginByApple',
  },
})
const emits = defineEmits(['click'])
</script>
