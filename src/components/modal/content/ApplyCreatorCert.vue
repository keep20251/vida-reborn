<template>
  <div class="space-y-20 border-t">
    <div class="mt-20">
      <div class="mb-10">Select country/region</div>
      <Dropdown
        v-model="country"
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
      <div
        v-for="item in identities"
        :key="`identity-${item.value}`"
        class="border-sm flex cursor-pointer items-center justify-center space-x-10 rounded-md border-gray-f6 bg-gray-f6 py-5"
        @click="onIdentitySelected(item.value)"
      >
        <Icon :name="item.icon" size="50"></Icon>
        <div class="font-base font-normal leading-md">{{ item.label }}</div>
      </div>
    </div>
  </div>

  <div class="mb-20 text-center text-sm font-normal leading-lg text-gray-57">{{ content }}</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBecomeCreatorStore } from '@/store/become-creator'
import { useModalStore } from '@/store/modal'
import Dropdown from '@comp/form/Dropdown.vue'
import { useConfirmData } from '@use/modal/confirm-data'
import { useI18nPack } from '@use/request/i18nPack'
import { BECOME_CREATOR_IDENTITY } from '@const'

const emit = defineEmits(['component:confirm'])

const countries = useI18nPack('select', 'about', [])
const identities = [
  { label: 'Passport', icon: 'passport', value: BECOME_CREATOR_IDENTITY.PASSPORT },
  { label: 'Identity Card', icon: 'identityCard', value: BECOME_CREATOR_IDENTITY.IDENTITY_CARD },
  { label: 'Driver License', icon: 'driverLicense', value: BECOME_CREATOR_IDENTITY.DRIVER_LICENSE },
]

const { identity, country } = storeToRefs(useBecomeCreatorStore())

const modalStore = useModalStore()
const { content } = storeToRefs(modalStore)

const router = useRouter()

function onIdentitySelected(value) {
  identity.value = value
  emit('component:confirm')
}
useConfirmData(() => router.push({ name: 'mine-creator-identity-agreement' }))
</script>
