<template>
  <a
    class="block cursor-pointer text-inherit no-underline"
    :href="localeHref"
    :title="title"
    @click="onClick"
    @click.capture.prevent
  >
    <slot></slot>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useRouters } from '@use/routers'
import { useLocale } from '@use/utils/locale'

const props = defineProps({
  href: { type: String },
  title: { type: String },
  toRoute: { type: Boolean, default: false },
  toCreator: { type: Boolean, default: false },
  toFeed: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const locale = useLocale()
const localeHref = computed(() => {
  if (!props.href) {
    return `/${locale.value}`
  }
  return props.href.startsWith('/') ? `/${locale.value}${props.href}` : `/${locale.value}/${props.href}`
})

const { toCreator: redirectToCreator, to: redirectTo, toFeed: redirectToFeed } = useRouters()

function onClick(evt) {
  evt.preventDefault()
  emit('click')
  if (props.toRoute) redirectTo(props.href)
  if (props.toCreator) redirectToCreator(props.href)
  if (props.toFeed) redirectToFeed(props.href)
}
</script>
