<template>
  <div class="border-t pt-20">
    <label class="leading-md text-base font-normal not-italic">{{ $t('title.prefer') }}： </label>
    <OptionsPicker v-model="interested" :options="options" class="!justify-start"></OptionsPicker>
    <div class="py-20 text-sm font-normal leading-3 text-gray66">{{ $t('label.multiple') }}</div>
    <Button @click="savePref">{{ $t('common.save') }}</Button>
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useI18n } from 'vue-i18n'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import useRequest from '@use/request/index.js'

const { t: $t } = useI18n()

const accountStore = useAccountStore()
const { userData } = accountStore

const mineStore = useMineStore()
const { interested } = storeToRefs(mineStore)

onMounted(()=>{
  interested.value = userData.interested.split(',').map(Number);
})


const options = ref([
  { label: $t('content.foodieRecipe'), value: 1 },
  { label: $t('content.educatorTeaching'), value: 2 },
  { label: $t('content.photoInsta'), value: 3 },
  { label: $t('content.beautyFasion'), value: 4 },
  { label: $t('content.news'), value: 5 },
  { label: $t('content.travelPhoto'), value: 6 },
  { label: $t('content.gameHost'), value: 7 },
  { label: $t('content.cosplay'), value: 8 },
  { label: $t('content.lgScale'), value: 9 },
  { label: $t('content.nsfwMale'), value: 10 },
  { label: $t('content.nsfwFemale'), value: 11 },
])

const serverError = ref('')
async function savePref() {
  const { execute } = useRequest('User.modifyInfo')
  try{
    await execute({
      interested: interested.value.join(',')
    })
    console.log('成功囉！')
  } catch(e){
    serverError.value = e.message
    console.error(e)
  }
}

</script>
