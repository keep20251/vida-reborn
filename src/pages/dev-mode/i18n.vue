<template>
  <Page>
    <template #default>
      <div class="mt-32 w-full p-8">
        <div class="flex flex-col justify-center gap-4 align-middle">
          <div class="flex justify-center align-middle">
            <div class="w-2/4 bg-slate-100">
              <div class="flex flex-col justify-center gap-4">
                <div class="text-center text-xl font-bold">i18n Testing Text</div>
                <div class="text-center text-xl font-bold">{{ $t('common.loading') }}</div>
                <div
                  v-for="(lang, index) in langs"
                  :key="`lang-${index}`"
                  class="cursor-pointer text-center hover:text-green-500"
                  @click="storageLocale = lang.replace('_', '-')"
                >
                  {{ $t(`lang.${lang}`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { initLocale } from '@/i18n'
import { useLocalStorage } from '@vueuse/core'
import Page from '@/components/layout/Page.vue'

const langs = ['en', 'zh_cn', 'zh_tw', 'es', 'fr', 'de', 'th', 'vi', 'ja', 'ko', 'ru', 'pt', 'id', 'ar', 'hi']
const storageLocale = useLocalStorage('__LOCALE', initLocale)
</script>
