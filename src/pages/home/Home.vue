<template>
  <div class="mt-32 p-8 w-full">
    <div class="flex flex-col gap-4 justify-center align-middle">
      <div class="text-3xl font-bold underline text-blue-300 whitespace-nowrap flex justify-center">
        Vite <span class="text-3xl text-green-500">SSR</span>
      </div>
      <div class="text-xl font-bold text-red-600 flex justify-center">Store Counter: {{ counter }}</div>
      <div class="flex justify-center align-middle">
        <button class="px-8 py-1 rounded-md bg-green-500" @click="increment">Increment</button>
      </div>
      <div class="flex justify-center align-middle">
        <div class="bg-slate-100 w-2/4">
          <div class="flex flex-col gap-4 justify-center">
            <div class="text-center text-xl font-bold">i18n Testing Text</div>
            <div class="text-center text-xl font-bold">{{ $t('common.loading') }}</div>
            <div
              v-for="(lang, index) in langs"
              :key="`lang-${index}`"
              class="text-center cursor-pointer hover:text-green-500"
              @click="changeLang(lang.replace('_', '-'))"
            >
              {{ $t(`lang.${lang}`) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCounterStore } from '@/store/counter'
import { storeToRefs } from 'pinia'
import { initLocale } from '@/i18n'
import { useLocalStorage } from '@vueuse/core'

const counterStore = useCounterStore()
const { counter } = storeToRefs(counterStore)
const { increment } = counterStore

const langs = ['en', 'zh_cn', 'zh_tw', 'es', 'fr', 'de', 'th', 'vi', 'ja', 'ko', 'ru', 'pt', 'id', 'ar', 'hi']
const storageLocale = useLocalStorage('__LOCALE', initLocale)
function changeLang(lang) {
  console.log(`change lang`, lang)
  storageLocale.value = lang
}
</script>
