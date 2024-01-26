<template>
  <div>
    <div v-if="isLogin">
      <HomeCreator v-if="isPermission"></HomeCreator>
      <HomeRegister v-else></HomeRegister>
    </div>
    <div v-else>
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
      <div class="text-gray-57 text-center text-base font-normal leading-lg">
        <p>{{ $t('content.joinVida') }}</p>
        <p>
          {{ $t('content.useObey')
          }}<a href="#"
            ><b class="pl-3">{{ $t('content.tos') }}</b></a
          >
        </p>
      </div>
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
import HomeCreator from '@comp/mine/HomeCreator.vue'
import HomeRegister from '@comp/mine/HomeRegister.vue'
import { AUTH_ROUTES } from '@/constant'

const { t: $t } = useI18n()
const { isLogin, userData } = storeToRefs(useAccountStore())

const isPermission = computed(() => {
  if (userData.value?.auth_status === 2) {
    return true
  } else {
    return false
  }
})

const { open: openAuthDialog } = useAuthRouteStore()
</script>
