<template>
  <div class="border-t pt-20">
    <label class="text-base font-normal not-italic leading-md">{{ $t('title.prefer') }}： </label>
    <OptionsPicker v-model="multiplePickedOptions" :options="options" class="!justify-start"></OptionsPicker>
    <div class="py-20 text-sm font-normal leading-3 text-gray66">{{ $t('label.multiple') }}</div>
    <Button @click="onBtnClick">{{ $t('common.save') }}</Button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'

const multiplePickedOptions = ref([1])
const options = ref([
  { label: '美食家/食谱创作者', value: 1 },
  { label: '教育者/教学创作者', value: 2 },
  { label: '摄影师/Instagrammer', value: 3 },
  { label: '美妆/时尚专家', value: 4 },
  { label: '旅行部落客/摄影家', value: 5 },
  { label: '游戏实况主', value: 6 },
  { label: '大尺度内容', value: 7 },
  { label: 'NSFW( 男性向)', value: 8 },
  { label: 'NSFW( 女性向)', value: 9 },
])

const onBtnClick = () => {
  console.log(multiplePickedOptions.value)
}
</script>
