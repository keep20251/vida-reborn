<template>
  <div class="border-t pt-20">
    <label class="text-base font-normal not-italic leading-md">{{ $t('title.prefer') }}： </label>
    <OptionsPicker v-model="interested" :options="categories" class="!justify-start"></OptionsPicker>
    <div class="py-20 text-sm font-normal leading-3 text-gray-57">{{ $t('label.multiple') }}</div>
    <Button @click="savePref">{{ $t('common.save') }}</Button>
    <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import useRequest from '@use/request/index.js'

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const accountStore = useAccountStore()
const { userData } = accountStore

const mineStore = useMineStore()
const { interested } = storeToRefs(mineStore)

onMounted(() => {
  interested.value = userData.interested.split(',').map(String) // 字串轉成陣列
})

const serverError = ref('')
async function savePref() {
  const { execute } = useRequest('User.modifyInfo')
  try {
    await execute({
      interested: interested.value.join(','), // 陣列轉回字串
    })
    console.log('成功囉！')
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
