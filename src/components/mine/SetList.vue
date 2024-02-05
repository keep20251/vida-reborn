<template>
  <div class="flex select-none flex-col divide-y">
    <!-- <div v-if="perm.registerLogin" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center space-x-18" @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.join') }}</span>
      </div>
      <div class="flex cursor-pointer items-center space-x-18" @click="openAuthDialog()">
        <Icon name="setting" size="20"></Icon>
        <span>{{ $t('title.login') }}</span>
      </div>
    </div> -->
    <div v-if="perm.postEarn" class="grid space-y-10 py-10">
      <router-link :to="{ name: 'mine-post' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="minePost" size="20"></Icon>
        <span>{{ $t('title.post') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-earn' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="mineEarn" size="20"></Icon>
        <span>{{ $t('title.earn') }}</span>
      </router-link>
    </div>
    <div v-if="perm.buyCollect" class="grid space-y-10 py-10">
      <router-link :to="{ name: 'mine-buy' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="mineBuy" size="20"></Icon>
        <span>{{ $t('title.buy') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-collect' }" class="flex cursor-pointer items-center space-x-18">
        <Icon name="mineCollect" size="20"></Icon>
        <span>{{ $t('title.collect') }}</span>
      </router-link>
    </div>
    <div v-if="perm.beCreator" class="grid space-y-10 py-10">
      <router-link :to="`/${locale}/mine/creator`" class="flex cursor-pointer items-center space-x-18">
        <Icon name="mineBeCreator" size="20"></Icon>
        <span>{{ $t('title.beCreator') }}</span>
      </router-link>
    </div>
    <div v-if="perm.settings" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="accOpen = !accOpen">
        <div class="flex items-center space-x-18">
          <Icon name="mineSet" size="20"></Icon>
          <span>{{ $t('title.setting') }}</span>
        </div>
        <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': accOpen === true }"></Icon>
      </div>
      <div class="pl-20 transition-all" :class="{ hidden: !accOpen }">
        <div class="flex w-full flex-col space-y-10 transition-all delay-1000" :class="{ hidden: !accOpen }">
          <router-link :to="{ name: 'mine-account' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineSetAcc" size="20"></Icon><span>{{ $t('title.usnMail') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-password' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineSetPw" size="20"></Icon><span>{{ $t('title.password') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-preference' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineSetPrefer" size="20"></Icon><span>{{ $t('title.prefer') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-block' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineSetBlock" size="20"></Icon><span>{{ $t('title.blockAcc') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-delete' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineSetDelAcc" size="20"></Icon><span>{{ $t('title.delAcc') }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex justify-between space-y-5 py-10">
      <div class="flex items-center space-x-18">
        <Icon name="mineLang" size="20"></Icon>
        <span>{{ $t('title.language') }}</span>
      </div>
      <Dropdown class="w-[120px]" v-model="locale" :options="transOptions"></Dropdown>
    </div>
    <div class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="aboutOpen = !aboutOpen">
        <div class="flex items-center space-x-18">
          <Icon name="mineAbout" size="20"></Icon>
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
            <Icon name="mineAboutTos" size="20"></Icon><span>{{ $t('title.tos') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-pp' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineAboutPp" size="20"></Icon><span>{{ $t('title.pp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-cp' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineAboutCp" size="20"></Icon><span>{{ $t('title.cp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-dmca' }" class="flex cursor-pointer items-center space-x-18">
            <Icon name="mineAboutDmca" size="20"></Icon><span>DMCA</span>
          </router-link>
          <div class="items-center space-x-18 flex">
            <Icon name="mineAboutVersion" size="20"></Icon><span>V1.0.0</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="perm.logout" class="grid space-y-10 py-10">
      <div class="flex cursor-pointer items-center space-x-18" @click="logout">
        <Icon name="mineLogout" size="20"></Icon>
        <span>{{ $t('title.logout') }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import Dropdown from '@comp/form/Dropdown.vue'
import { useLocale } from '@use/utils/locale'
import { AUTH_ROUTES } from '@const'
import { PERM_TABLE } from '@const/mine'
import { locales } from '@/i18n'

const accountStore = useAccountStore()
const { role } = storeToRefs(accountStore)

const perm = computed(() => PERM_TABLE[role.value])

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
