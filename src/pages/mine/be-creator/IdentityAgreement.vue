<template>
  <div class="w-full">
    <div class="flex flex-col space-y-20 text-base font-normal leading-lg">
      <div>{{ $t('beCreator.idAgreement.1') }}</div>
      <div class="text-gray-57">
        <ul class="flex list-inside list-decimal flex-col space-y-20">
          <li>
            {{ $t('beCreator.idAgreement.2') }}
            <ul class="ml-35 list-lower-alpha">
              <li>{{ $t('beCreator.idAgreement.3') }}</li>
              <li>{{ $t('beCreator.idAgreement.4') }}</li>
            </ul>
          </li>
          <li>
            {{ $t('beCreator.idAgreement.5') }}
            <ul class="ml-35 list-lower-alpha">
              <li>{{ $t('beCreator.idAgreement.6') }}</li>
              <li>{{ $t('beCreator.idAgreement.7') }}</li>
              <li>{{ $t('beCreator.idAgreement.8') }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="text-gray-57">
        {{ $t('beCreator.idAgreement.9') }}
      </div>
      <div class="text-gray-57">
        {{ $t('beCreator.idAgreement.10') }}
      </div>
      <div class="text-center text-gray-a3">
        <div>{{ $t('beCreator.idAgreement.11') }}</div>
        <div>
          {{ $t('beCreator.idAgreement.12') }}
          <span class="text-black"><a href="mailto:support@vida.pub">support@vida.pub</a></span>
        </div>
      </div>
      <router-link :to="{ name: 'mine-creator-take-picture' }">
        <Button>{{ $t('beCreator.btn.startTakePic') }}</Button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import Button from '@comp/common/Button.vue'
</script>
