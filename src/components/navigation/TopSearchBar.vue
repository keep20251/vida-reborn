<template>
  <div class="flex h-full items-center space-x-20">
    <Link v-if="logo" title="VIDA" @click="to('home')">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <InputWrap
      class="grow"
      v-model="input"
      :placeholder="$t('placeholder.search')"
      append-icon="search2"
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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@/compositions/routers'

const { t: $t } = useI18n()

const props = defineProps({
  inputValue: { type: String, default: '' },
  logo: { type: Boolean, default: false },
  featureIcon: { type: String },
  toSearch: { type: Boolean, default: false },
})
const emits = defineEmits(['feature', 'search'])

const input = ref(props.inputValue)
watch(
  () => props.inputValue,
  (v) => (input.value = v),
)

const { to } = useRouters()

const triggerSearch = debounce(() => {
  emits('search', input.value)
  if (input.value && props.toSearch) to('search', { query: { q: input.value } })
}, 500)
</script>
