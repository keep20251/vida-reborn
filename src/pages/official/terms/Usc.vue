<template>
  <div class="h-full w-full items-center justify-center px-[5%] py-[5%]">
    <div class="text-md font-normal leading-lg">
      <div class="font-bold">
        {{ i18n?.usc?.line1 }}
      </div>
      <div class="font-bold">
        {{ i18n?.usc?.line2 }}
      </div>
      <div class="flex flex-col space-y-20">
        <div>
          <div class="font-bold">
            {{ i18n?.usc?.line3 }}
          </div>
          <div>
            {{ i18n?.usc?.line4 }}
          </div>
        </div>
        <div>
          <div class="font-bold">
            {{ i18n?.usc?.line5 }}
          </div>
          <div>
            {{ i18n?.usc?.line6 }}
          </div>
        </div>
        <div>
          <div class="font-bold">
            {{ i18n?.usc?.line7 }}
          </div>
          <div>
            {{ i18n?.usc?.line8 }}
          </div>
        </div>
        <div>
          <div class="font-bold">
            {{ i18n?.usc?.line9 }}
          </div>
          <div>
            {{ i18n?.usc?.line10 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('usc')
</script>
