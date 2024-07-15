<template>
  <div v-if="initLoading" class="h-[12.8125rem] w-full rounded-md bg-light-gray"></div>
  <div v-else class="grid space-y-20 rounded-md bg-gray-f6 px-20 py-30">
    <div class="flex flex-col space-y-10">
      <div class="text-lg font-bold leading-lg">{{ $t('content.annArea') }}</div>
      <div class="text-lg font-bold leading-lg">{{ $t('content.annTitle') }}</div>
      <div class="text-base font-normal leading-lg">
        {{ $t('content.annCtn') }}
      </div>
    </div>
    <button
      v-if="isVisitor"
      @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)"
      class="flex w-full items-center justify-center rounded-full bg-primary px-45 py-10 text-base font-bold leading-md text-white"
    >
      {{ $t('content.annBtn') }}
    </button>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@const'

const { isVisitor } = storeToRefs(useAccountStore())

const { open: openAuthDialog } = useAuthRouteStore()

const initLoading = ref(true)
onMounted(() => {
  setTimeout(() => (initLoading.value = false), 300)
})
</script>
