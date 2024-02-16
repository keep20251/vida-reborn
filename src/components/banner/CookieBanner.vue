<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-full"
    enter-to-class="transform translate-y-0"
    leave-active-class="transition duration-300 ease-out"
    leave-from-class="transform translate-y-0"
    leave-to-class="transform -translate-y-full"
  >
    <div
      v-if="show"
      class="fixed left-0 top-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 py-30"
    >
      <div class="flex flex-col space-y-20 px-[15%]">
        <i18n-t keypath="content.cookie.line" tag="div" class="text-center text-sm font-normal leading-4 text-white">
          <template #word>
            <span class="cursor-pointer underline" @click="openCookiePolicy">{{ $t('content.cookie.word') }}</span>
          </template>
        </i18n-t>
        <div class="flex w-full justify-center">
          <button class="h-24 rounded-full bg-contrast px-45 text-center" @click="() => (cookieAgreement = true)">
            <span class="text-center text-sm font-normal leading-3">{{ $t('common.cookie') }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { useModalStore } from '@/store/modal'
import { LOCAL_STORAGE_KEYS, MODAL_TYPE } from '@const'

const { t: $t } = useI18n()

const cookieAgreement = useLocalStorage(LOCAL_STORAGE_KEYS.COOKIE_AGREEMENT, false)
const show = computed(() => !cookieAgreement.value)

const { open } = useModalStore()
const openCookiePolicy = () => {
  open(MODAL_TYPE.COOKIE_POLICY, {
    title: $t('title.cp'),
    size: 'lg',
    confirmText: $t('common.confirm'),
    confirmAction: () => {},
  })
}
</script>
