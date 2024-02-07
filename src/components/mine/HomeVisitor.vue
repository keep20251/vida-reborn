<template>
  <div>
    <div class="flex items-center justify-center py-20">
      <div class="text-lg font-bold leading-5">{{ $t('info.loginOrRegister') }}</div>
    </div>
    <div class="mb-10 text-base font-normal leading-md">{{ $t('content.notLoggedYet') }}</div>
    <div class="bg-gray-e5 w-[500px] h-[300px]">
      <img class="rounded-md object-cover" src="" alt="" />
    </div>
    <div class="my-30 flex space-x-10">
      <Button @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)" contrast>{{ $t('title.join') }}</Button>
      <Button @click="openAuthDialog()">{{ $t('title.login') }}</Button>
    </div>
    <div class="text-center text-base font-normal leading-lg text-gray-57">
      <p>{{ $t('content.joinVida') }}</p>
      <p>
        {{ $t('content.useObey')
        }}<a href="#"
          ><b class="pl-3">{{ $t('content.tos') }}</b></a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthRouteStore } from '@/store/auth-route'
import Button from '@comp/common/Button.vue'
import { AUTH_ROUTES } from '@const'

const { t: $t } = useI18n()
const { open: openAuthDialog } = useAuthRouteStore()
</script>
