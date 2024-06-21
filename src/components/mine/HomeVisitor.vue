<template>
  <div>
    <div class="flex flex-col items-center justify-center py-20">
      <img class="mb-50 w-[12.5rem]" src="@/assets/images/registration-portal.svg?url" alt="Error" />
      <div class="text-lg font-bold leading-5">{{ $t('info.loginOr') }}{{ $t('info.quickRegister') }}</div>
    </div>
    <div class="mb-10 text-center text-base font-normal leading-md">{{ $t('content.notLoggedYet') }}</div>
    <div class="my-30 flex space-x-10">
      <Button @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)" contrast>{{ $t('title.join') }}</Button>
      <Button @click="openAuthDialog()">{{ $t('title.login') }}</Button>
    </div>
    <div class="text-center text-base font-normal leading-lg text-gray-57">
      <p>{{ $t('content.joinVida') }}</p>
      <i18n-t keypath="content.useObey" tag="p">
        <template #tos>
          <span class="cursor-pointer font-bold" @click="openTermsOfService">{{ $t('content.tos') }}</span>
        </template>
      </i18n-t>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'
import { useAuthRouteStore } from '@/store/auth-route'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import { AUTH_ROUTES, MODAL_TYPE } from '@const'

const { t: $t } = useI18n()
const { open: openAuthDialog } = useAuthRouteStore()
const { open } = useModalStore()

function openTermsOfService() {
  open(MODAL_TYPE.TERMS_OF_SERVICE, {
    title: $t('title.tos'),
    size: 'lg',
    confirmText: $t('common.confirm'),
    confirmAction: () => {},
  })
}

// 快捷鍵開啟登入彈窗 ctrl + shift + L
let active = false
onMounted(() => (active = true))
onActivated(() => (active = true))
onDeactivated(() => (active = false))
useEventListener('keypress', (evt) => {
  if (active && evt.ctrlKey && evt.shiftKey && ['l', 'L'].includes(evt.key)) {
    openAuthDialog(AUTH_ROUTES.LOGIN)
  }
})
</script>
