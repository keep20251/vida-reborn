<script setup>
const props = defineProps({
  text: { type: String, default: 'Button' },
  click: {
    type: Function,
    default: () => {
      console.log('btn click')
    },
  },
})

const handleClick = () => {
  props.click()
}
</script>

<template>
  <!-- TODO:: if router match this link then fond bold is bold else normal -->
  <div @click.prevent="handleClick" class="text-lg font-bold">{{ text }}</div>
</template>
