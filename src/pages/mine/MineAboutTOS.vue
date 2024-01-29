<template>
  <div>
    <div class="space-y-5">
      <div class="text-sm font-medium leading-md">{{ i18n.tos?.info.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.info.content1 }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.info.content2 }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.info.content3 }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.definitions.title }}</div>
      <div class="text-xs font-normal leading-md">
        <div>
          {{ i18n.tos?.definitions.table.title.a }}:
          {{ i18n.tos?.definitions.table.content.a }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.b }}:
          {{ i18n.tos?.definitions.table.content.b }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.c }}:
          {{ i18n.tos?.definitions.table.content.c }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.d }}:
          {{ i18n.tos?.definitions.table.content.d }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.e }}:
          {{ i18n.tos?.definitions.table.content.e }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.f }}:
          {{ i18n.tos?.definitions.table.content.f }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.g }}:
          {{ i18n.tos?.definitions.table.content.g }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.h }}:
          {{ i18n.tos?.definitions.table.content.h }}
        </div>
        <div>
          {{ i18n.tos?.definitions.table.title.i }}:
          {{ i18n.tos?.definitions.table.content.i }}
        </div>
      </div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.aboutService.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.aboutService.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.jurisdictional.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.jurisdictional.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.minors.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.minors.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.privacyPolicy.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.privacyPolicy.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.userRegistration.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.userRegistration.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.devicesServices.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.devicesServices.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.modifications.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.modifications.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.content.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.content.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.license.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.license.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.userInteractions.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.userInteractions.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.prohibitedConduct.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.prohibitedConduct.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.customerSupport.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.customerSupport.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.advertising.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.advertising.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.creditsPurchases.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.creditsPurchases.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.cardPaymentProcessing.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.cardPaymentProcessing.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.refundPolicy.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.refundPolicy.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.becomingCreator.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.becomingCreator.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.commission.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.commission.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.thirdParty.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.thirdParty.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.termination.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.termination.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.limitationLiability.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.limitationLiability.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.indemnification.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.indemnification.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.copyright.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.copyright.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.intellectualProperty.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.intellectualProperty.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.informationSecurity.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.informationSecurity.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.governingLaw.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.governingLaw.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.contact.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.contact.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.miscellaneous.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.miscellaneous.content }}</div>
      <div class="text-sm font-medium leading-md pt-2">{{ i18n.tos?.language.title }}</div>
      <div class="text-xs font-normal leading-md">{{ i18n.tos?.language.content }}</div>
      <div class="text-xs font-normal leading-md pt-2">{{ i18n.tos?.final }}</div>
      <div class="text-xs font-normal leading-md pt-2">{{ i18n.tos?.fantasi }}</div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('tos')
</script>
