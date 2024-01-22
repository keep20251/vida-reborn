<template>
  <a
    class="block cursor-pointer text-inherit no-underline"
    :href="href"
    :title="title"
    @click="(evt) => $emit('click', evt)"
    @click.capture.prevent
  >
    <slot></slot>
  </a>
</template>

<script setup>
defineProps({
  href: { type: String },
  title: { type: String },
})

defineEmits(['click'])
</script>
