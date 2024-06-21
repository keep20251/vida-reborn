<template>
  <div class="h-full w-full rounded-xl bg-gray-f6 py-30 pr-20">
    <div class="scrollbar-md max-h-[37.5rem] overflow-y-auto">
      <div class="flex flex-col space-y-20 px-20 text-base font-normal leading-lg">
        <h5 class="">{{ i18nPack.pp?.info.title }}</h5>
        <p class="">{{ i18nPack.pp?.info.content }}</p>
        <h5 class="">{{ i18nPack.pp?.definitions.title }}</h5>
        <table class="border-collapse">
          <tr>
            <th class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.a }}</th>
            <th class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.a }}</th>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.b }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.b }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.c }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.c }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.d }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.d }}</td>
          </tr>

          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.e }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.e }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.f }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.f }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.g }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.g }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.h }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.h }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.title.i }}</td>
            <td class="border border-solid border-gray-e5 p-8">{{ i18nPack.pp?.definitions.table.content.i }}</td>
          </tr>
        </table>
        <h5 class="">{{ i18nPack.pp?.termsService.title }}</h5>
        <p class="">{{ i18nPack.pp?.termsService.content }}</p>
        <h5 class="">{{ i18nPack.pp?.modifications.title }}</h5>
        <p class="">{{ i18nPack.pp?.modifications.content }}</p>
        <h5 class="">{{ i18nPack.pp?.collectYou.title }}</h5>
        <p class="">{{ i18nPack.pp?.collectYou.content }}</p>
        <h5 class="">{{ i18nPack.pp?.usePersonalInfo.title }}</h5>
        <p class="">{{ i18nPack.pp?.usePersonalInfo.content }}</p>
        <h5 class="">{{ i18nPack.pp?.changePurpose.title }}</h5>
        <p class="">{{ i18nPack.pp?.changePurpose.content }}</p>
        <h5 class="">{{ i18nPack.pp?.disclose.title }}</h5>
        <p class="">{{ i18nPack.pp?.disclose.content }}</p>
        <h5 class="">{{ i18nPack.pp?.usersIn.title }}</h5>
        <p class="">{{ i18nPack.pp?.usersIn.content }}</p>
        <h5 class="">{{ i18nPack.pp?.accountDeletion.title }}</h5>
        <p class="">{{ i18nPack.pp?.accountDeletion.content }}</p>
        <h5 class="">{{ i18nPack.pp?.thirdParty.title }}</h5>
        <p class="">{{ i18nPack.pp?.thirdParty.content }}</p>
        <h5 class="">{{ i18nPack.pp?.retention.title }}</h5>
        <p class="">{{ i18nPack.pp?.retention.content }}</p>
        <h5 class="">{{ i18nPack.pp?.mergerSale.title }}</h5>
        <p class="">{{ i18nPack.pp?.mergerSale.content }}</p>
        <h5 class="">{{ i18nPack.pp?.minors.title }}</h5>
        <p class="">{{ i18nPack.pp?.minors.content }}</p>
        <h5 class="">{{ i18nPack.pp?.track.title }}</h5>
        <p class="">{{ i18nPack.pp?.track.content }}</p>
        <h5 class="">{{ i18nPack.pp?.contact.title }}</h5>
        <p class="">{{ i18nPack.pp?.contact.content }}</p>
        <h5 class="">{{ i18nPack.pp?.miscellaneous.title }}</h5>
        <p class="">{{ i18nPack.pp?.miscellaneous.content }}</p>
        <h5 class="">{{ i18nPack.pp?.language.title }}</h5>
        <p class="">{{ i18nPack.pp?.language.content }}</p>
        <p class="">{{ i18nPack.pp?.final }}</p>
        <p class="">{{ i18nPack.pp?.fantasi }}</p>
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

const i18nPack = useI18nPack('pp')
</script>
