<template>
  <div>
    <div class="space-y-5">
      <div class="text-sm font-medium leading-md">{{ i18n.pp?.info.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.info.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.definitions.title }}</div>
      <div class="text-xs font-normal leading-md">
        <div>
          {{ i18n.pp?.definitions.table.title.a }}:
          {{ i18n.pp?.definitions.table.content.a }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.b }}:
          {{ i18n.pp?.definitions.table.content.b }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.c }}:
          {{ i18n.pp?.definitions.table.content.c }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.d }}:
          {{ i18n.pp?.definitions.table.content.d }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.e }}:
          {{ i18n.pp?.definitions.table.content.e }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.f }}:
          {{ i18n.pp?.definitions.table.content.f }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.g }}:
          {{ i18n.pp?.definitions.table.content.g }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.h }}:
          {{ i18n.pp?.definitions.table.content.h }}
        </div>
        <div>
          {{ i18n.pp?.definitions.table.title.i }}:
          {{ i18n.pp?.definitions.table.content.i }}
        </div>
      </div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.termsService.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.termsService.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.modifications.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.modifications.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.collectYou.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.collectYou.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.usePersonalInfo.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.usePersonalInfo.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.changePurpose.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.changePurpose.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.disclose.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.disclose.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.usersIn.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.usersIn.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.accountDeletion.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.accountDeletion.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.thirdParty.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.thirdParty.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.retention.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.retention.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.mergerSale.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.mergerSale.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.minors.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.minors.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.track.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.track.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.contact.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.contact.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.miscellaneous.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.miscellaneous.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.pp?.language.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.pp?.language.content }}</div>
      <div class="text-xs font-normal leading-md pt-2">{{ i18n.pp?.final }}</div>
      <div class="text-xs font-normal leading-md pt-2">{{ i18n.pp?.fantasi }}</div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('pp')
</script>
