<template>
  <transition
    enter-active-class="transition duration-700 ease-out"
    enter-from-class="transform translate-y-n-full"
    enter-to-class="transform translate-y-0"
    leave-active-class="transition duration-700 ease-in"
    leave-from-class="transform translate-y-0"
    leave-to-class="transform translate-y-n-full"
  >
    <div
      v-show="show"
      class="fixed left-0 top-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 py-30"
    >
      <div class="flex flex-col space-y-20 px-[15%]">
        <i18n-t keypath="content.cookie.line" tag="div" class="text-center text-sm font-normal leading-4 text-white">
          <template #word>
            <span class="cursor-pointer underline">{{ $t('content.cookie.word') }}</span>
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
import { useLocalStorage } from '@vueuse/core'
import { LOCAL_STORAGE_KEYS } from '@/constant'
import { computed } from 'vue'

const cookieAgreement = useLocalStorage(LOCAL_STORAGE_KEYS.COOKIE_AGREEMENT, false)
const show = computed(() => !cookieAgreement.value)
</script>
