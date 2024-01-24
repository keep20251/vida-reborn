<template>
  <div>
    <div class="mb-20 text-center text-base font-bold leading-lg">帖子主題：</div>
    <Loading v-if="isLoading"></Loading>
    <OptionsPicker v-else v-model="interested" :options="interestedOptions" center></OptionsPicker>
    <div class="mt-30 text-center">
      <div class="text-base font-bold leading-lg">至少選擇三個主題</div>
      <div class="text-base font-bold leading-lg">太棒了！</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import useRequest from '@use/request'
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(validator)

const { data, isLoading, execute } = useRequest('Article.categories')

const interested = ref([])
const interestedOptions = ref([])

function validator() {
  if (interested.value.length < 3) {
    return false
  }
  return interested.value.slice()
}

onMounted(() => {
  execute().then(() => {
    Object.entries(data.value.list).forEach(([value, label], i) => {
      interestedOptions.value.push({ label, value })
      if (i < 3) {
        interested.value.push(value)
      }
    })
  })
})
</script>
