<template>
  <div class="flex h-full items-center space-x-20">
    <Link v-if="logo" href="/home" title="VIDA" @click="reload">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <!-- <InputWrap
      class="grow"
      v-model="input"
      :placeholder="$t('placeholder.search')"
      append-icon="search2"
      @click:append="triggerSearch"
      @keypress:enter="triggerSearch"
      @keyup="autoTriggerSearch"
    ></InputWrap> -->
    <div v-if="featureIcon" class="flex" @click="emits('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import debounce from 'lodash/debounce'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearchStore } from '@/store/search'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@/compositions/routers'

const { t: $t } = useI18n()

const props = defineProps({
  inputValue: { type: String, default: '' },
  logo: { type: Boolean, default: false },
  featureIcon: { type: String },
  toSearch: { type: Boolean, default: false },
  autoTrigger: { type: Boolean, default: false },
})
const emits = defineEmits(['feature'])

const input = ref(props.inputValue)
watch(
  () => props.inputValue,
  (v) => (input.value = v),
)

const searchStore = useSearchStore()
const { reset } = searchStore
const { to, reload } = useRouters()

const triggerSearch = debounce(() => {
  if (props.toSearch) {
    if (input.value) {
      to('search', { query: { q: input.value } })
    } else {
      if (props.autoTrigger) {
        reset()
        to('search')
      }
    }
  }
}, 500)
const autoTriggerSearch = () => {
  if (props.autoTrigger) {
    triggerSearch()
  }
}
</script>
