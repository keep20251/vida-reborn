<template>
  <div class="flex h-full items-center space-x-20">
    <Link v-if="logo" :href="`/${locale}`" title="VIDA" @click="router.push({ name: 'home' })">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <InputWrap
      class="grow"
      v-model="searchValue"
      :placeholder="$t('placeholder.search')"
      append-icon="search2"
      @update:modelValue="$emit('update:keyword', searchValue)"
      @click:append="$emit('trigger:search')"
      @keypress:enter="$emit('trigger:search')"
    ></InputWrap>
    <div v-if="featureIcon" class="flex" @click="$emit('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useLocaleReadonly } from '@use/utils/localeReadonly'

const { t: $t } = useI18n()

defineProps({
  logo: { type: Boolean, default: false },
  featureIcon: { type: String },
})
defineEmits(['feature', 'trigger:search', 'update:keyword'])

const searchValue = ref('')

const locale = useLocaleReadonly()

const router = useRouter()
</script>
