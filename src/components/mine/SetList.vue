<template>
  <div class="flex flex-col">
    <div class="grid gap-y-10 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>免費加入</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>立即登入</span>
      </div>
    </div>
    <div class="grid gap-y-10 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>我的收益</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>我的購買</span>
      </div>
    </div>
    <div class="grid gap-y-10 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>我的帖子</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>我的收藏</span>
      </div>
    </div>
    <div class="grid gap-y-10 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>帳戶設置</span>
      </div>
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>成為創作者</span>
      </div>
    </div>
    <div class="flex justify-between gap-y-10 border-b py-10">
      <div class="flex items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>語言設置</span>
      </div>
      <Dropdown
        class="w-[120px]"
        v-model="dropdownLocal"
        :options="transOptions"
        @update:modelValue="setLocale"
      ></Dropdown>
    </div>
    <div class="grid gap-y-10 border-b py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>關於</span>
      </div>
    </div>
    <div class="grid gap-y-10 py-10">
      <div class="flex cursor-pointer items-center gap-x-5">
        <Icon name="setting" :size="16"></Icon>
        <span>登出</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from '@/i18n'
import { ref, watch } from 'vue'
import Dropdown from '@comp/form/Dropdown.vue'

const { locales, locale, useVueI18nInstance } = useI18n()
const { setLocale } = useVueI18nInstance()

const transOptions = locales.map((lang) => ({
  label: `lang.${lang.label}`,
  value: lang.value,
}))

const dropdownLocal = ref(locale.value)
watch(locale, (newLocale) => {
  dropdownLocal.value = newLocale
})
</script>
