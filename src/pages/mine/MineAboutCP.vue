<template>
  <div>
    <div class="space-y-5">
      <div class="text-sm font-medium leading-md">{{ i18n.cp?.info.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.info.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.definitions.title }}</div>
      <div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.b }}：{{ i18n.cp?.definitions.table.content.b }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.c }}：{{ i18n.cp?.definitions.table.content.c }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.d }}：{{ i18n.cp?.definitions.table.content.d }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.e }}：{{ i18n.cp?.definitions.table.content.e }}
        </div>
      </div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.modifications.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.modifications.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.useCookie.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.useCookie.content1 }}</div>
      <div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.useCookie.table.title.a }}：{{ i18n.cp?.useCookie.table.content.a }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.b }}：{{ i18n.cp?.definitions.table.content.b }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.c }}：{{ i18n.cp?.definitions.table.content.c }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.d }}：{{ i18n.cp?.definitions.table.content.d }}
        </div>
        <div class="text-xs font-normal leading-md">
          {{ i18n.cp?.definitions.table.title.e }}：{{ i18n.cp?.definitions.table.content.e }}
        </div>
      </div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.useCookie.content2 }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.analyticsAd.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.analyticsAd.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.choices.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.choices.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.contact.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.contact.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.miscellaneous.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.miscellaneous.content }}</div>
      <div class="pt-2 text-sm font-medium leading-md">{{ i18n.cp?.language.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.cp?.language.content }}</div>
      <div class="pt-2 text-xs font-normal leading-md">{{ i18n.cp?.final }}</div>
      <div class="pt-2 text-xs font-normal leading-md">{{ i18n.cp?.fantasi }}</div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('cp')
</script>
