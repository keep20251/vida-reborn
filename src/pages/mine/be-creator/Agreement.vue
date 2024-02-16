<template>
  <div class="w-full">
    <div class="mb-10">
      {{ $t('beCreator.agreement.title') }}
    </div>
    <div
      class="scrollbar-md mb-30 h-[530px] min-h-[250px] space-y-2 overflow-y-scroll rounded-md bg-gray-f6 p-20 text-base font-normal leading-lg text-gray-57"
    >
      <p>
        {{ $t('beCreator.agreement.1') }}
      </p>
      <p>
        {{ $t('beCreator.agreement.2') }}
      </p>
      <p>{{ $t('beCreator.agreement.3') }}</p>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.4') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.5') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.6') }}
        </li>
      </ul>
      <div class="pt-24">
        {{ $t('beCreator.agreement.7') }}
      </div>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.8') }}
        </li>
      </ul>
      <div class="pt-24">
        {{ $t('beCreator.agreement.9') }}
      </div>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.10') }}
        </li>
      </ul>
      <li>
        {{ $t('beCreator.agreement.11') }}
      </li>
      <li>
        {{ $t('beCreator.agreement.12') }}
      </li>
      <div class="pt-24">
        {{ $t('beCreator.agreement.13') }}
      </div>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.14') }}
        </li>
      </ul>
      <li>{{ $t('beCreator.agreement.15') }}</li>
      <li>
        {{ $t('beCreator.agreement.16') }}
      </li>
      <div class="pt-24">{{ $t('beCreator.agreement.17') }}</div>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.18') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.19') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.20') }}
        </li>
      </ul>
      <div class="pt-24">
        {{ $t('beCreator.agreement.21') }}
      </div>
      <ul class="!list-disc pl-20">
        <li>
          {{ $t('beCreator.agreement.22') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.23') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.24') }}
        </li>
        <li>
          {{ $t('beCreator.agreement.25') }}
        </li>
      </ul>
    </div>
    <ol class="mb-20 !list-decimal space-y-10 pl-20 text-base font-normal leading-lg text-gray-57">
      <li>
        {{ $t('beCreator.agreement.26') }}
        <b>{{ $t('beCreator.agreement.27') }}</b>
      </li>
      <li>
        {{ $t('beCreator.agreement.28') }}
        <b>{{ $t('beCreator.agreement.29') }}</b>
        {{ $t('beCreator.agreement.30') }}
      </li>
      <li>
        {{ $t('beCreator.agreement.31') }}
      </li>
      <li>
        {{ $t('beCreator.agreement.32') }} <b>{{ $t('beCreator.agreement.33') }}</b>
        {{ $t('beCreator.agreement.34') }}
      </li>
    </ol>
    <div class="text-center text-base font-normal leading-lg text-gray-a3">
      {{ $t('beCreator.agreement.35') }}
    </div>
    <p class="text-center text-base font-normal leading-lg text-gray-a3">
      {{ $t('beCreator.agreement.36') }}
      <a class="text-gray-57" href="mail:support@vida.pub">support@vida.pub</a>
    </p>
    <Button @click="openSocialLinkDialog" class="my-30"> {{ $t('beCreator.agreement.btn') }}</Button>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'

const { t: $t } = useI18n()

const modalStore = useModalStore()
const { open } = modalStore

const openSocialLinkDialog = () => {
  open(MODAL_TYPE.APPLY_CREATOR_CERT, {
    size: 'lg',
    title: $t('beCreator.title.chooseDoc'),
    confirmText: $t('common.next'),
    confirmAction: () => {},
    showClose: true,
    showConfirm: false,
  })
}
</script>
