<template>
  <a
    class="block cursor-pointer text-inherit no-underline"
    :href="localeHref"
    :title="title"
    @click="(evt) => emit('click', evt)"
    @click.capture.prevent
  >
    <slot></slot>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@use/utils/locale'

const props = defineProps({
  href: { type: String },
  title: { type: String },
})

const emit = defineEmits(['click'])

const locale = useLocale()
const localeHref = computed(() => {
  if (!props.href) {
    return `/${locale.value}`
  }
  return props.href.startsWith('/') ? `/${locale.value}${props.href}` : `/${locale.value}/${props.href}`
})
</script>
