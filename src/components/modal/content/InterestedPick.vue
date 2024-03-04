<template>
  <div>
    <div class="-ml-36 -mt-30 mb-20 w-[calc(100%+4.5rem)] rounded-t-xl bg-primary py-12">
      <div class="text-center text-base font-bold leading-lg text-white">{{ $t('modal.beforeStart') }}</div>
      <div class="text-center text-base font-bold leading-lg text-white">{{ $t('modal.pickInterestedForUs') }}</div>
    </div>
    <div class="mb-20 text-center text-base font-bold leading-lg">{{ $t('modal.feedCategory') }}</div>
    <OptionsPicker v-model="interested" :options="categories" center></OptionsPicker>
    <div class="mt-30 text-center">
      <div class="text-base font-bold leading-lg" :class="{ 'text-warning': err }">{{ tipText }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import { useConfirmData } from '@use/modal/confirm-data'
import { MODAL_TYPE } from '@const'

useConfirmData(validator)

const interested = ref([])
const err = ref(false)

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const modalStore = useModalStore()
const { type, content } = storeToRefs(modalStore)
whenever(
  () => type.value === MODAL_TYPE.INTERESTED_PICK,
  (v) => (interested.value = content.value || []),
  { immediate: true },
)

const LEAST_COUNT = 3
const { t: $t } = useI18n()
const tipText = computed(() => {
  const count = LEAST_COUNT - interested.value.length
  if (count <= 0) {
    return $t('modal.completeCategory')
  } else if (count <= 2) {
    return $t('modal.moreCategory', { count })
  } else {
    return $t('modal.leastCategory', { count })
  }
})

function validator() {
  if (interested.value.length < 3) {
    err.value = true
    return false
  }

  return interested.value.slice()
}
</script>
