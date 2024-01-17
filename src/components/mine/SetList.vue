<template>
  <div class="flex select-none flex-col">
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.join') }}</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5" @click="openAuthDialog()">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.login') }}</span>
      </div>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <router-link :to="{ name: 'mine-buy' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.buy') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-post' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.post') }}</span>
      </router-link>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <router-link :to="{ name: 'mine-collect' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.collect') }}</span>
      </router-link>
      <router-link :to="{ name: 'mine-earn' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.earn') }}</span>
      </router-link>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <router-link :to="{ name: 'mine-creator' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.beCreator') }}</span>
      </router-link>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="accOpen = !accOpen">
        <div class="flex items-center gap-x-5">
          <Icon name="setting" size="16"></Icon>
          <span>{{ $t('title.setting') }}</span>
        </div>
        <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': accOpen === true }"></Icon>
      </div>
      <div class="transition-all" :class="[{ 'pl-20': accOpen }]">
        <div class="flex w-full flex-col gap-y-5 transition-all delay-1000" :class="{ hidden: !accOpen }">
          <router-link :to="{ name: 'mine-account' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.usnMail') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-password' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.password') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-preference' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.prefer') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-block' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.blockAcc') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-delete' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.delAcc') }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="flex justify-between gap-y-5 border-b py-10">
      <div class="flex items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.language') }}</span>
      </div>
      <Dropdown class="w-[120px]" v-model="locale" :options="transOptions"></Dropdown>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="aboutOpen = !aboutOpen">
        <div class="flex items-center gap-x-5">
          <Icon name="setting" size="16"></Icon>
          <span>{{ $t('title.about') }}</span>
        </div>
        <Icon
          name="dropdown"
          size="8"
          class="transition-transform"
          :class="{ 'rotate-180': aboutOpen === true }"
        ></Icon>
      </div>
      <div class="transition-all" :class="[{ 'pl-20': aboutOpen }]">
        <div class="flex w-full flex-col gap-y-5 transition-all delay-1000" :class="{ hidden: !aboutOpen }">
          <router-link :to="{ name: 'mine-tos' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.tos') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-pp' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.pp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-cp' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>{{ $t('title.cp') }}</span>
          </router-link>
          <router-link :to="{ name: 'mine-dmca' }" class="flex cursor-pointer items-center gap-x-5">
            <Icon name="setting" size="16"></Icon><span>DMCA</span>
          </router-link>
          <div class="flex items-center gap-x-5"><Icon name="setting" size="16"></Icon><span>V1.0.0</span></div>
        </div>
      </div>
    </div>

    <div class="grid gap-y-5 py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="logout">
        <Icon name="setting" size="16"></Icon>
        <span>{{ $t('title.logout') }}</span>
      </div>
    </div>
    <div v-if="isDev" class="grid gap-y-5 rounded-xl border-b bg-slate-200 px-10 py-10">
      <div class="text-red-600">開發模式用</div>
      <router-link :to="{ name: 'mine-profile-set' }" class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>創作者主頁設置</span>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import Dropdown from '@comp/form/Dropdown.vue'
import { useLocale } from '@use/utils/locale'
import { locales } from '@/i18n'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const accOpen = ref(false)
const aboutOpen = ref(false)

const locale = useLocale()

const transOptions = locales.map((lang) => ({
  label: `lang.${lang.label}`,
  value: lang.value,
}))

const { open: openAuthDialog } = useAuthRouteStore()
const { logout } = useAccountStore()

const { push } = useRouter()

const isDev = computed(() => import.meta.env.DEV)
</script>
