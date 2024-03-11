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
  <div class="flex items-center justify-center p-2">
    <Icon name="officialMenu" size="25"></Icon>
  </div>
</template>
