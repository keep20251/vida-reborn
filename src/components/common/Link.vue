<template>
  <a
    class="block cursor-pointer text-inherit no-underline"
    :href="localeHref"
    :title="title"
    @click="(evt) => $emit('click', evt)"
    @click.capture.prevent
  >
    <slot></slot>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useLocaleReadonly } from '@use/utils/localeReadonly'

const props = defineProps({
  href: { type: String },
  title: { type: String },
})

defineEmits(['click'])

const locale = useLocaleReadonly()
const localeHref = computed(() => {
  return props.href.startsWith('/') ? `/${locale.value}${props.href}` : `/${locale.value}/${props.href}`
})
</script>
