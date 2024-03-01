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
import { onActivated, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useMineStore } from '@/store/mine'
import { usePopupMessageStore } from '@/store/popup-message'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import useRequest from '@use/request/index.js'

const { open: openMessage } = usePopupMessageStore()

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const accountStore = useAccountStore()
const { userData } = storeToRefs(accountStore)
const { updateUserData } = accountStore

const mineStore = useMineStore()
const { interested } = storeToRefs(mineStore)

onActivated(() => {
  interested.value = userData.value.interested.split(',')
})

const serverError = ref('')
async function savePref() {
  const { execute } = useRequest('User.modifyInfo')
  try {
    const data = interested.value.join(',')
    await execute({
      interested: data, // 陣列轉回字串
    })
    updateUserData({ interested: data })
    openMessage('title.updateSuccess')
  } catch (e) {
    serverError.value = e.message
    openMessage('title.updateFail')
  }
}
</script>
