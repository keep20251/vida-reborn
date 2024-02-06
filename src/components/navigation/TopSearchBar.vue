<template>
  <div class="flex h-full items-center space-x-20">
    <Link v-if="logo" title="VIDA" @click="to('home')">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <InputWrap
      class="grow"
      v-model="modelValue"
      :placeholder="$t('placeholder.search')"
      append-icon="search2"
      @update:modelValue="emits('update:keyword', modelValue)"
      @click:append="triggerSearch"
      @keypress:enter="triggerSearch"
    ></InputWrap>
    <div v-if="featureIcon" class="flex" @click="emits('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import debounce from 'lodash/debounce'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@use/routers'

const { t: $t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  logo: { type: Boolean, default: false },
  featureIcon: { type: String },
  toSearch: { type: Boolean, default: false },
})
const emits = defineEmits(['feature', 'trigger:search', 'update:keyword', 'update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emits('update:modelValue', v),
})

const { to } = useRouters()

const triggerSearch = debounce(() => {
  emits('trigger:search')
  if (modelValue.value && props.toSearch) {
    to('search', { query: { q: modelValue.value } }).then(() => (modelValue.value = ''))
  }
}, 500)
</script>
