<template>
  <div class="flex select-none flex-col divide-y">
    <div v-if="role.registerLogin" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center space-x-18" @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.join') }}</span>
      </div>
      <div class="flex cursor-pointer items-center space-x-18" @click="openAuthDialog()">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.login') }}</span>
      </div>
    </div>
    <div v-if="role.postEarn" class="grid space-y-10 py-10">
      <router-link :to="{ name: 'mine-post' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.post') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-earn' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.earn') }}</span>
      </router-link>
    </div>
    <div v-if="role.buyCollect" class="grid space-y-10 py-10">
      <router-link :to="{ name: 'mine-buy' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.buy') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-collect' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.collect') }}</span>
      </router-link>
    </div>
    <div v-if="role.beCreator" class="grid space-y-10 py-10">
      <router-link :to="`/${locale}/mine/creator`" class="flex cursor-pointer items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.beCreator') }}</span>
      </router-link>
    </div>
    <div v-if="role.settings" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="accOpen = !accOpen">
        <div class="flex items-center space-x-18">
          <Icon name="setting" size="20"></Icon>
          <span>{{ $t('title.setting') }}</span>
        </div>
        <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': accOpen === true }"></Icon>
      </div>
      <div class="pl-20 transition-all" :class="{ hidden: !accOpen }">
        <div class="flex w-full flex-col space-y-10 transition-all delay-1000" :class="{ hidden: !accOpen }">
          <router-link :to="{ name: 'mine-account' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.usnMail') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-password' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.password') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-preference' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.prefer') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-block' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.blockAcc') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-delete' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.delAcc') }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex justify-between space-y-5 py-10">
      <div class="flex items-center space-x-18">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.language') }}</span>
      </div>
      <Dropdown class="w-[120px]" v-model="locale" :options="transOptions"></Dropdown>
    </div>
    <div class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="aboutOpen = !aboutOpen">
        <div class="flex items-center space-x-18">
          <Icon name="setting" size="20"></Icon>
          <span>{{ $t('title.about') }}</span>
        </div>
        <Icon
          name="dropdown"
          size="8"
          class="transition-transform"
          :class="{ 'rotate-180': aboutOpen === true }"
        ></Icon>
      </div>
      <div class="pl-20 transition-all" :class="{ hidden: !aboutOpen }">
        <div class="flex w-full flex-col space-y-10 transition-all delay-1000" :class="{ hidden: !aboutOpen }">
          <router-link :to="{ name: 'mine-tos' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.tos') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-pp' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.pp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-cp' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>{{ $t('title.cp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-dmca' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="setting" size="20"></Icon><span>DMCA</span>
          </router-link>
          <div class="flex items-center space-x-5"><Icon name="setting" size="20"></Icon><span>V1.0.0</span></div>
        </div>
      </div>
    </div>

    <div v-if="role.logout" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center space-x-18" @click="logout">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.logout') }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { usePermissionStore } from '@/store/permission'
import Dropdown from '@comp/form/Dropdown.vue'
import { useLocale } from '@use/utils/locale'
import { AUTH_ROUTES, AUTH_STATUS, PERMISSION } from '@const'
import { locales } from '@/i18n'

const accountStore = useAccountStore()
const { userData, isLogin } = storeToRefs(accountStore)

const permissionStore = usePermissionStore()
const { role } = storeToRefs(permissionStore)

console.log('你登入了嗎？', isLogin.value)
console.log('是2就是創作者', userData.value?.auth_status)
console.log('使用者資料', userData.value)

watchEffect(() => {
  if (!isLogin.value) {
    role.value = PERMISSION.VISITOR
    console.log('你是遊客')
  } else if (userData.value?.auth_status === AUTH_STATUS.CREATOR) {
    role.value = PERMISSION.CREATOR
    console.log('你是創作者')
  } else {
    role.value = PERMISSION.REGISTERED
    console.log('你是一般會員')
  }
})

const accOpen = ref(false)
const aboutOpen = ref(false)

const locale = useLocale()

const transOptions = locales.map((lang) => ({
  label: `lang.${lang.label}`,
  value: lang.value,
}))

const { open: openAuthDialog } = useAuthRouteStore()
const { logout } = useAccountStore()
</script>
