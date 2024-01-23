<template>
  <div class="space-y-20 border-t">
    <div class="mt-20">
      <div class="mb-10">Select country/region</div>
      <Dropdown v-model="dropdownValue" :options="options" inset> </Dropdown>
    </div>
    <div class="leading-md text-center text-base font-normal text-gray66">Choose a document and start verification</div>
    <div class="space-y-10">
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray03 py-5">
        <Icon name="passport" size="50"></Icon>
        <div class="leading-md font-base font-normal">Passport</div>
      </div>
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray03 py-5">
        <Icon name="identityCard" size="50"></Icon>
        <div class="leading-md font-base font-normal">Identity Card</div>
      </div>
      <div class="flex cursor-pointer items-center justify-center space-x-10 rounded-md bg-gray03 py-5">
        <Icon name="driverLicense" size="50"></Icon>
        <div class="leading-md font-base font-normal">Driver License</div>
      </div>
    </div>
  </div>

  <div class="leading-lg mb-20 text-center text-sm font-normal text-gray66">{{ content }}</div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import Dropdown from '@comp/form/Dropdown.vue'

const modalStore = useModalStore()
const { content } = storeToRefs(modalStore)

const dropdownValue = ref(1)
const options = ref([
  { label: '台灣', value: 1 },
  { label: '英國', value: 2 },
  { label: '菲律賓', value: 3 },
  { label: '加拿大', value: 4 },
  { label: '澳洲', value: 5 },
  { label: '義大利', value: 6 },
  { label: '冰島', value: 7 },
  { label: '奈及利亞', value: 8 },
  { label: '哈爾濱', value: 9 },
  { label: '法國', value: 10 },
])
</script>
