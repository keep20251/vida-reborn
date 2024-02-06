<template>
  <div>
    <div class="space-y-5">
      <div class="text-base font-medium leading-md">{{ i18n.dmca?.info.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.info.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.notice.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.notice.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.contact.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.contact.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.procedure.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.procedure.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.counterNotification.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.counterNotification.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.infringer.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.infringer.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.modifications.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.modifications.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.requests.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.requests.content }}</div>
      <div class="text-base font-medium leading-md pt-2">{{ i18n.dmca?.language.title }}</div>
      <div class="text-sm font-normal leading-md">{{ i18n.dmca?.language.content }}</div>
      <div class="text-sm font-normal leading-md pt-2">{{ i18n.dmca?.final }}</div>
      <div class="text-sm font-normal leading-md pt-2">{{ i18n.dmca?.fantasi }}</div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('dmca')
</script>
