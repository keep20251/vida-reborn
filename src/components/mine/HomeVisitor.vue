<template>
  <div>
    <div class="flex items-center justify-center py-20">
      <div class="text-lg font-bold leading-5">{{ $t('info.loginOrRegister') }}</div>
    </div>
    <div class="mb-10 text-base font-normal leading-md">{{ $t('content.notLoggedYet') }}</div>
    <img
      class="rounded-md object-cover"
      src="https://i.postimg.cc/G2b2HYJ1/415980634-122147312060020771-8911205471669409308-n.jpg"
      alt=""
    />
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import Button from '@comp/common/Button.vue'
import { AUTH_ROUTES } from '@/constant'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())
const { open: openAuthDialog } = useAuthRouteStore()
</script>
