<template>
  <div class="h-full w-full items-center justify-center px-[5%] py-[5%]">
    <div class="flex flex-col space-y-20 text-md font-normal leading-lg">
      <div>
        {{ i18n?.cpp?.line1 }}
      </div>
      <div>
        {{ i18n?.cpp?.line2 }}
      </div>
      <div>
        {{ i18n?.cpp?.line3 }}
      </div>
      <div>
        {{ i18n?.cpp?.line4 }}
      </div>
      <div>
        {{ i18n?.cpp?.line5 }}
      </div>
      <div>
        {{ i18n?.cpp?.line6 }}
      </div>
      <div>
        {{ i18n?.cpp?.line7 }}
      </div>
      <div>
        <div>
          {{ i18n?.cpp?.line8 }}
        </div>
        <div>
          {{ i18n?.cpp?.line9 }}
        </div>
        <div>
          {{ i18n?.cpp?.line10 }}
        </div>
        <div>
          {{ i18n?.cpp?.line11 }}
        </div>
      </div>

      <div>
        <div>
          {{ i18n?.cpp?.line12 }}
        </div>
        <div>
          {{ i18n?.cpp?.line13 }}
        </div>
        <div>
          {{ i18n?.cpp?.line14 }}
        </div>
      </div>

      <div>
        <div>
          {{ i18n?.cpp?.line15 }}
        </div>
        <div>
          {{ i18n?.cpp?.line16 }}
        </div>
        <div>
          {{ i18n?.cpp?.line17 }}
        </div>
        <div>
          {{ i18n?.cpp?.line18 }}
        </div>
      </div>

      <div>
        <div>
          {{ i18n?.cpp?.line19 }}
        </div>
        <div>
          {{ i18n?.cpp?.line20 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('cpp')
</script>
