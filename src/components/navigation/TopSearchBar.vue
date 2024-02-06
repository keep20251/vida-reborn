<template>
  <div class="flex h-full items-center space-x-20">
    <Link v-if="logo" title="VIDA" @click="to('home')">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <InputWrap
      class="grow"
      v-model="searchValue"
      :placeholder="$t('placeholder.search')"
      append-icon="search2"
      @update:modelValue="$emit('update:keyword', searchValue)"
      @click:append="triggerSearch"
      @keypress:enter="triggerSearch"
    ></InputWrap>
    <div v-if="featureIcon" class="flex" @click="$emit('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@use/routers'
import { useLocale } from '@use/utils/locale'

const { t: $t } = useI18n()

const props = defineProps({
  logo: { type: Boolean, default: false },
  featureIcon: { type: String },
  toSearch: { type: Boolean, default: false },
})
const emits = defineEmits(['feature', 'trigger:search', 'update:keyword'])

const searchValue = ref('')

const locale = useLocale()

const { to } = useRouters()

function triggerSearch() {
  emits('trigger:search')
  if (searchValue.value && props.toSearch) {
    to('search', { query: { q: searchValue.value } }).then(() => (searchValue.value = ''))
  }
}
</script>
