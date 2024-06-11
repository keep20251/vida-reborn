<template>
  <div>
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
import { useConfirmData } from '@use/modal/confirm-data'

const { content } = storeToRefs(useModalStore())

const { t: $t } = useI18n()
const documents = [
  computed(() => $t('modal.shopBuy.1', { nickname: content.value?.user?.nickname })),
  computed(() => $t('modal.shopBuy.2', { nickname: content.value?.user?.nickname })),
]

useConfirmData(() => true)
</script>
