<template>
  <div class="flex items-center space-x-20">
    <Link :href="`/${locale}`" title="VIDA" @click="router.push({ name: 'home' })">
      <img class="h-30 w-54" src="@/assets/logo.svg?url" alt="VIDA" />
    </Link>
    <InputWrap class="grow" v-model="searchValue" :placeholder="'搜索...'" append-icon="search2"></InputWrap>
    <div v-if="featureIcon" class="flex" @click="$emit('feature')">
      <Icon :name="featureIcon" size="20"></Icon>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Link from '@comp/common/Link.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useLocaleReadonly } from '@use/utils/localeReadonly'

defineProps({
  featureIcon: { type: String },
})
defineEmits(['feature'])

const searchValue = ref('')

const locale = useLocaleReadonly()

const router = useRouter()
</script>
