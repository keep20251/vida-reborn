<template>
  <div class="flex select-none flex-col">
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)">
        <Icon name="setting" size="16"></Icon>
        <span>免費加入</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5" @click="openAuthDialog()">
        <Icon name="setting" size="16"></Icon>
        <span>立即登入</span>
      </div>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-earn' })">
        <Icon name="setting" size="16"></Icon>
        <span>我的收益</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-buy' })">
        <Icon name="setting" size="16"></Icon>
        <span>我的購買</span>
      </div>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-post' })">
        <Icon name="setting" size="16"></Icon>
        <span>我的帖子</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-collect' })">
        <Icon name="setting" size="16"></Icon>
        <span>我的收藏</span>
      </div>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-creator' })">
        <Icon name="setting" size="16"></Icon>
        <span>成為創作者</span>
      </div>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="accOpen = !accOpen">
        <div class="flex items-center gap-x-5">
          <Icon name="setting" size="16"></Icon>
          <span>帳戶設置</span>
        </div>
        <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': accOpen === true }"></Icon>
      </div>
      <div class="transition-all" :class="[{ 'pl-20': accOpen }]">
        <div class="flex w-full flex-col gap-y-5 transition-all delay-1000" :class="{ hidden: !accOpen }">
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-account' })">
            <Icon name="setting" size="16"></Icon><span>名稱</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-password' })">
            <Icon name="setting" size="16"></Icon><span>密碼</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-preference' })">
            <Icon name="setting" size="16"></Icon><span>偏好顯示</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-block' })">
            <Icon name="setting" size="16"></Icon><span>封禁名單</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-delete' })">
            <Icon name="setting" size="16"></Icon><span>刪除帳戶</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between gap-y-5 border-b py-10">
      <div class="flex items-center gap-x-5">
        <Icon name="setting" size="16"></Icon>
        <span>語言設置</span>
      </div>
      <Dropdown class="w-[120px]" v-model="locale" :options="transOptions"></Dropdown>
    </div>
    <div class="grid gap-y-5 border-b py-10">
      <div class="flex cursor-pointer items-center justify-between pr-15" @click="aboutOpen = !aboutOpen">
        <div class="flex items-center gap-x-5">
          <Icon name="setting" size="16"></Icon>
          <span>關於</span>
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
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-tos' })">
            <Icon name="setting" size="16"></Icon><span>服務條款</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-pp' })">
            <Icon name="setting" size="16"></Icon><span>隱私政策</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-cp' })">
            <Icon name="setting" size="16"></Icon><span>Cookie 政策</span>
          </div>
          <div class="flex cursor-pointer items-center gap-x-5" @click="push({ name: 'mine-dmca' })">
            <Icon name="setting" size="16"></Icon><span>DMCA</span>
          </div>
          <div class="flex items-center gap-x-5"><Icon name="setting" size="16"></Icon><span>V1.0.0</span></div>
        </div>
      </div>
    </div>

    <div class="grid gap-y-5 py-10">
      <div class="flex cursor-pointer items-center gap-x-5" @click="logout">
        <Icon name="setting" size="16"></Icon>
        <span>登出</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import Dropdown from '@comp/form/Dropdown.vue'
import { useI18n } from '@use/utils/i18n'
import { locales } from '@/i18n'
import { useAccountStore } from '@/store/account'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const accOpen = ref(false)
const aboutOpen = ref(false)

const { locale } = useI18n()

const transOptions = locales.map((lang) => ({
  label: `lang.${lang.label}`,
  value: lang.value,
}))

const { open: openAuthDialog } = useAuthRouteStore()
const { logout } = useAccountStore()

const { push } = useRouter()
</script>
