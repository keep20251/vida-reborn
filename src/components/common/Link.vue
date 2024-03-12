<template>
  <a
    class="block cursor-pointer text-inherit no-underline"
    :href="href"
    :title="title"
    @click="(evt) => emit('click', evt)"
    @click.capture.prevent
  >
    <slot></slot>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: { type: String },
  title: { type: String },
})

const emit = defineEmits(['click'])

const href = computed(() => {
  if (!props.href) {
    return '/'
  }
  if (!props.href.startsWith('/')) {
    return `/${props.href}`
  }
  return props.href
})
</script>
