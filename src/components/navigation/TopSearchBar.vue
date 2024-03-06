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
import { useRoute } from 'vue-router'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '@/store/search'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'

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

const searchStore = useSearchStore()
const { historyTags } = storeToRefs(searchStore)
const { onSearch } = searchStore

const triggerSearch = debounce(() => {
  emits('search', input.value)
  if (input.value && props.toSearch) {
    onSearch(input.value)

    if (historyTags.value.find((tag) => tag.value === input.value)) return
    historyTags.value.push({ value: input.value, label: input.value })
  }
}, 500)

const route = useRoute()
watchImmediate(
  () => route.query?.q,
  (value) => (input.value = value),
)
</script>
