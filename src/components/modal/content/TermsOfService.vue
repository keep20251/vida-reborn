<template>
  <div class="h-full w-full rounded-xl bg-gray05 py-30 pr-20">
    <div class="scrollbar-md max-h-[37.5rem] overflow-y-scroll">
      <div class="flex flex-col space-y-20 px-20 text-base font-normal leading-lg">
        <h5>{{ i18nPack.tos?.info.title }}</h5>
        <h5>{{ i18nPack.tos?.info.content1 }}</h5>
        <h5>{{ i18nPack.tos?.info.content2 }}</h5>
        <h5>{{ i18nPack.tos?.info.content3 }}</h5>
        <h5>{{ i18nPack.tos?.definitions.title }}</h5>
        <table class="border-collapse">
          <tr>
            <th class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.a }}</th>
            <th class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.a }}</th>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.b }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.b }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.c }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.c }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.d }}</td>
            <td class="border border-solid border-gray10 p-8">
              {{ i18nPack.tos?.definitions.table.content.d }}
            </td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.e }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.e }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.f }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.f }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.g }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.g }}</td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.h }}</td>
            <td class="border border-solid border-gray10 p-8">
              {{ i18nPack.tos?.definitions.table.content.h }}
            </td>
          </tr>
          <tr>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.title.i }}</td>
            <td class="border border-solid border-gray10 p-8">{{ i18nPack.tos?.definitions.table.content.i }}</td>
          </tr>
        </table>
        <div class="flex flex-col space-y-20 even:pt-8">
          <h5>{{ i18nPack.tos?.aboutService.title }}</h5>
          <p>{{ i18nPack.tos?.aboutService.content }}</p>
          <h5>{{ i18nPack.tos?.jurisdictional.title }}</h5>
          <p>{{ i18nPack.tos?.jurisdictional.content }}</p>
          <h5>{{ i18nPack.tos?.minors.title }}</h5>
          <p>{{ i18nPack.tos?.minors.content }}</p>
          <h5>{{ i18nPack.tos?.privacyPolicy.title }}</h5>
          <p>{{ i18nPack.tos?.privacyPolicy.content }}</p>
          <h5>{{ i18nPack.tos?.userRegistration.title }}</h5>
          <p>{{ i18nPack.tos?.userRegistration.content }}</p>
          <h5>{{ i18nPack.tos?.devicesServices.title }}</h5>
          <p>{{ i18nPack.tos?.devicesServices.content }}</p>
          <h5>{{ i18nPack.tos?.modifications.title }}</h5>
          <p>{{ i18nPack.tos?.modifications.content }}</p>
          <p>{{ i18nPack.tos?.content.title }}</p>
          <p>{{ i18nPack.tos?.content.content }}</p>
          <h5>{{ i18nPack.tos?.license.title }}</h5>
          <p>{{ i18nPack.tos?.license.content }}</p>
          <h5>{{ i18nPack.tos?.userInteractions.title }}</h5>
          <p>{{ i18nPack.tos?.userInteractions.content }}</p>
          <h5>{{ i18nPack.tos?.prohibitedConduct.title }}</h5>
          <p>{{ i18nPack.tos?.prohibitedConduct.content }}</p>
          <h5>{{ i18nPack.tos?.customerSupport.title }}</h5>
          <p>{{ i18nPack.tos?.customerSupport.content }}</p>
          <h5>{{ i18nPack.tos?.advertising.title }}</h5>
          <p>{{ i18nPack.tos?.advertising.content }}</p>
          <h5>{{ i18nPack.tos?.creditsPurchases.title }}</h5>
          <p>{{ i18nPack.tos?.creditsPurchases.content }}</p>
          <h5>{{ i18nPack.tos?.cardPaymentProcessing.title }}</h5>
          <p>{{ i18nPack.tos?.cardPaymentProcessing.content }}</p>
          <h5>{{ i18nPack.tos?.refundPolicy.title }}</h5>
          <p>{{ i18nPack.tos?.refundPolicy.content }}</p>
          <h5>{{ i18nPack.tos?.becomingCreator.title }}</h5>
          <p>{{ i18nPack.tos?.becomingCreator.content }}</p>
          <h5>{{ i18nPack.tos?.commission.title }}</h5>
          <p>{{ i18nPack.tos?.commission.content }}</p>
          <h5>{{ i18nPack.tos?.thirdParty.title }}</h5>
          <p>{{ i18nPack.tos?.thirdParty.content }}</p>
          <h5>{{ i18nPack.tos?.termination.title }}</h5>
          <p>{{ i18nPack.tos?.termination.content }}</p>
          <h5>{{ i18nPack.tos?.limitationLiability.title }}</h5>
          <p>{{ i18nPack.tos?.limitationLiability.content }}</p>
          <h5>{{ i18nPack.tos?.indemnification.title }}</h5>
          <p>{{ i18nPack.tos?.indemnification.content }}</p>
          <h5>{{ i18nPack.tos?.copyright.title }}</h5>
          <p>{{ i18nPack.tos?.copyright.content }}</p>
          <h5>{{ i18nPack.tos?.intellectualProperty.title }}</h5>
          <p>{{ i18nPack.tos?.intellectualProperty.content }}</p>
          <h5>{{ i18nPack.tos?.informationSecurity.title }}</h5>
          <p>{{ i18nPack.tos?.informationSecurity.content }}</p>
          <h5>{{ i18nPack.tos?.governingLaw.title }}</h5>
          <p>{{ i18nPack.tos?.governingLaw.content }}</p>
          <h5>{{ i18nPack.tos?.contact.title }}</h5>
          <p>{{ i18nPack.tos?.contact.content }}</p>
          <h5>{{ i18nPack.tos?.miscellaneous.title }}</h5>
          <p>{{ i18nPack.tos?.miscellaneous.content }}</p>
          <h5>{{ i18nPack.tos?.language.title }}</h5>
          <p>{{ i18nPack.tos?.language.content }}</p>
        </div>

        <div>{{ i18nPack.tos?.final }}</div>
        <div>{{ i18nPack.tos?.fantasi }}</div>
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

const i18nPack = useI18nPack('tos')
</script>
