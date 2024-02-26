<template>
  <div>
    <div class="-ml-36 -mt-30 mb-20 w-[calc(100%+4.5rem)] rounded-t-xl bg-primary py-12">
      <div class="text-center text-base font-bold leading-lg text-white">{{ $t('modal.beforeStart') }}</div>
      <div class="text-center text-base font-bold leading-lg text-white">{{ $t('modal.pickInterestedForUs') }}</div>
    </div>
    <div class="mb-20 text-center text-base font-bold leading-lg">{{ $t('modal.feedCategory') }}</div>
    <OptionsPicker v-model="interested" :options="categories" center></OptionsPicker>
    <div class="mt-30 text-center">
      <div class="text-base font-bold leading-lg" :class="{ 'text-warning': err }">{{ $t('modal.leastThree') }}</div>
      <div class="text-base font-bold leading-lg">{{ $t('modal.great') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(validator)

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const interested = ref(categories.value.slice(0, 3).map((c) => c.value))
const err = ref(false)

function validator() {
  if (interested.value.length < 3) {
    err.value = true
    return false
  }

  return interested.value.slice()
}
</script>
