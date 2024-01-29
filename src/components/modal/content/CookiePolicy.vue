<template>
  <div class="h-full w-full rounded-xl bg-gray-f6 py-30 pr-20">
    <div class="scrollbar-md max-h-[37.5rem] overflow-y-scroll">
      <div class="flex flex-col space-y-20 px-20 text-base font-normal leading-lg">
        <div>{{ i18nPack.cp?.info.title }}</div>
        <div>{{ i18nPack.cp?.info.content }}</div>
        <div>{{ i18nPack.cp?.definitions.title }}</div>
        <table class="border-collapse">
          <tr>
            <th class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.title.a }}</th>
            <th class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.content.a }}</th>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.title.b }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.content.b }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.title.c }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.content.c }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.title.d }}</td>
            <td class="border border-solid border-gray-e5 p-8">
              {{ i18nPack.cp?.definitions.table.content.d }}
            </td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.title.e }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.definitions.table.content.e }}</td>
          </tr>
        </table>
        <div class="">{{ i18nPack.cp?.modifications.title }}</div>
        <div class="">{{ i18nPack.cp?.modifications.content }}</div>
        <div class="">{{ i18nPack.cp?.useCookie.title }}</div>
        <div class="">{{ i18nPack.cp?.useCookie.content1 }}</div>
        <table class="">
          <tr>
            <th>{{ i18nPack.cp?.useCookie.table.title.a }}</th>
            <th>{{ i18nPack.cp?.useCookie.table.content.a }}</th>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.title.b }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.content.b }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.title.c }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.content.c }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.title.d }}</td>
            <td class="border border-solid border-gray-e5 p-8">
              {{ i18nPack.cp?.useCookie.table.content.d }}
            </td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.title.e }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.cp?.useCookie.table.content.e }}</td>
          </tr>
        </table>
        <div class="">{{ i18nPack.cp?.useCookie.content2 }}</div>
        <div class="">{{ i18nPack.cp?.analyticsAd.title }}</div>
        <div class="">{{ i18nPack.cp?.analyticsAd.content }}</div>
        <div class="">{{ i18nPack.cp?.choices.title }}</div>
        <div class="">{{ i18nPack.cp?.choices.content }}</div>
        <div class="">{{ i18nPack.cp?.contact.title }}</div>
        <div class="">{{ i18nPack.cp?.contact.content }}</div>
        <div class="">{{ i18nPack.cp?.miscellaneous.title }}</div>
        <div class="">{{ i18nPack.cp?.miscellaneous.content }}</div>
        <div class="">{{ i18nPack.cp?.language.title }}</div>
        <div class="">{{ i18nPack.cp?.language.content }}</div>
        <div class="">{{ i18nPack.cp?.final }}</div>
        <div class="">{{ i18nPack.cp?.fantasi }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useConfirmData } from '@use/modal/confirm-data'
import { useI18nPack } from '@use/request/i18nPack'

useConfirmData(() => {
  return true
})

const i18nPack = useI18nPack('cp')
</script>
