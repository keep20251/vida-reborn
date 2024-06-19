<template>
  <div class="bg-primary">
    <pre>{{ props.item }}</pre>
  </div>
</template>
<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})
</script>
