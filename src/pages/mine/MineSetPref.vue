<template>
  <div class="border-t pt-20">
    <label class="leading-md text-base font-normal not-italic">{{ $t('title.prefer') }}： </label>
    <OptionsPicker v-model="multiplePickedOptions" :options="options" class="!justify-start"></OptionsPicker>
    <div class="py-20 text-sm font-normal leading-3 text-gray66">{{ $t('label.multiple') }}</div>
    <Button @click="onBtnClick">{{ $t('common.save') }}</Button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const multiplePickedOptions = ref([1])

const options = ref([
  { label: $t('content.foodieRecipe'), value: 1 },
  { label: $t('content.educatorTeaching'), value: 2 },
  { label: $t('content.photoInsta'), value: 3 },
  { label: $t('content.beautyFasion'), value: 4 },
  { label: $t('content.travelPhoto'), value: 5 },
  { label: $t('content.gameHost'), value: 6 },
  { label: $t('content.lgScale'), value: 7 },
  { label: $t('content.nsfwMale'), value: 8 },
  { label: $t('content.nsfwFemale'), value: 9 },
])

const onBtnClick = () => {
  console.log(multiplePickedOptions.value)
}
</script>
