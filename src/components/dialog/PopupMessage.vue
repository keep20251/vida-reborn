<template>
  <transition
    enter-active-class="transition duration-500 ease-in"
    leave-active-class="transition duration-500 ease-out"
    enter-from-class="transform scale-0"
    leave-to-class="transform scale-0"
    enter-to-class="transform scale-100"
    leave-from-class="transform scale-100"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-50 z-50 flex w-fit min-w-[10.625rem] items-center justify-center rounded-md bg-gray-a3 bg-opacity-50 px-16 py-8 text-base font-medium leading-md"
      :class="{
        'bg-warning bg-opacity-50': failedTheme,
        'bottom-70': isShow,
      }"
    >
      {{ $t(message) }}
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNavStore } from '@/store/nav'
import { usePopupMessageStore } from '@/store/popup-message'

const { isShow } = storeToRefs(useNavStore())
const { isOpen, message, failedTheme } = storeToRefs(usePopupMessageStore())
</script>
