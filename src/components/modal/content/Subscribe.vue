<template>
  <div class="flex h-full w-full flex-col items-center justify-center space-y-30">
    <div class="flex flex-col items-center justify-center space-y-6">
      <div class="text-base font-normal leading-lg">
        <span class="text-xl font-bold leading-xl">
          {{ content.price ?? '' }}
        </span>
        / {{ $t('unit.day', { days: content.expire_days ?? 30 }) }}
      </div>
      <div class="text-base font-bold leading-md text-subscribe-orange">{{ content.name ?? '' }}</div>
    </div>
    <div class="flex flex-col space-y-10">
      <div v-for="(doc, index) in documents" :key="`docuemnt-${index}`" class="flex flex-row items-center space-x-15">
        <Icon name="checkPrimary" size="20" class="flex items-center"></Icon>
        <div>{{ doc.value }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'

const { content } = storeToRefs(useModalStore())

const { t: $t } = useI18n()
const documents = [
  computed(() => $t('modal.subscribe.1', { days: content.value.expire_days })),
  computed(() => $t('modal.subscribe.2')),
  computed(() => $t('modal.subscribe.3')),
  computed(() => $t('modal.subscribe.4')),
]
</script>
