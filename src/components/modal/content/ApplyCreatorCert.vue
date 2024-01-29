<template>
  <div class="space-y-20 border-t">
    <div class="mt-20">
      <div class="mb-10">Select country/region</div>
      <Dropdown
        v-model="dropdownValue"
        :options="countries"
        option-label="name"
        option-value="code"
        disable-i18n
        inset
      ></Dropdown>
    </div>
    <div class="text-center text-base font-normal leading-md text-gray-57">
      Choose a document and start verification
    </div>
    <div class="space-y-10">
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray-f6 py-5">
        <Icon name="passport" size="50"></Icon>
        <div class="font-base font-normal leading-md">Passport</div>
      </div>
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray-f6 py-5">
        <Icon name="identityCard" size="50"></Icon>
        <div class="font-base font-normal leading-md">Identity Card</div>
      </div>
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray-f6 py-5">
        <Icon name="driverLicense" size="50"></Icon>
        <div class="font-base font-normal leading-md">Driver License</div>
      </div>
    </div>
  </div>

  <div class="mb-20 text-center text-sm font-normal leading-lg text-gray-57">{{ content }}</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import Dropdown from '@comp/form/Dropdown.vue'
import { useConfirmData } from '@use/modal/confirm-data'
import { useI18nPack } from '@use/request/i18nPack'

const dropdownValue = ref('CN')
const countries = useI18nPack('select', 'about', [])

const modalStore = useModalStore()
const { content } = storeToRefs(modalStore)

useConfirmData(onValidate)

const router = useRouter()
function onValidate() {
  console.log('onValidate')
  router.push({ name: 'mine-creator-identity-agreement' })
  return true
}
</script>
