<template>
  <header class="flex shrink-0 grow basis-60 justify-end overflow-x-hidden md:basis-72 xl:basis-[150px]">
    <nav class="fixed flex h-full min-h-[600px] w-60 flex-col overflow-x-hidden md:w-72 xl:w-[150px]">
      <Link
        class="mt-10 px-12 pb-20 pt-10 hover:bg-gray05"
        :href="`/${locale}`"
        title="VIDA"
        @click="router.push({ name: 'home' })"
      >
        <img class="h-20 w-36 xl:h-40 xl:w-72" src="@/assets/logo.svg?url" alt="VIDA" />
      </Link>
      <router-link :to="`/${locale}`">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atHome" name="home" size="20"></Icon>
          <Icon v-else name="homeOutline" size="20"></Icon>
          <div class="hidden text-base xl:block" :class="[atHome ? 'font-bold' : 'font-normal']">
            {{ $t('nav.home') }}
          </div>
        </div>
      </router-link>
      <router-link :to="`/${locale}/search`">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atSearch" name="search" size="20"></Icon>
          <Icon v-else name="searchOutline" size="20"></Icon>
          <div class="hidden text-base xl:block" :class="[atSearch ? 'font-bold' : 'font-normal']">
            {{ $t('nav.search') }}
          </div>
        </div>
      </router-link>
      <router-link :to="`/${locale}/message`">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atMessage" name="message" size="20"></Icon>
          <Icon v-else name="messageOutline" size="20"></Icon>
          <div class="hidden text-base xl:block" :class="[atMessage ? 'font-bold' : 'font-normal']">
            {{ $t('nav.message') }}
          </div>
        </div>
      </router-link>
      <router-link :to="`/${locale}/mine`">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atMine" name="mine" size="20"></Icon>
          <Icon v-else name="mineOutline" size="20"></Icon>
          <div class="hidden text-base xl:block" :class="[atMine ? 'font-bold' : 'font-normal']">
            {{ $t('nav.mine') }}
          </div>
        </div>
      </router-link>
      <Link :href="`/${locale}/publish`">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray05 xl:justify-start">
          <Icon name="publish2" size="20"></Icon>
          <div class="hidden text-base font-normal xl:block">
            {{ $t('nav.publish') }}
          </div>
        </div>
      </Link>
      <div v-if="isDev" class="mr-16 mt-16 rounded-lg bg-slate-300 px-16 py-16 opacity-0 hover:opacity-100">
        <div class="flex flex-col space-y-10">
          <router-link
            v-for="route in devRoutes"
            class="font-bold hover:text-green-700"
            :to="route.path.replace(':lang', locale)"
            :key="route.path.replace(':lang', locale)"
          >
            {{ route.name.replace('devmode-', '') }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocale } from '@use/utils/locale'
import devRoutes from '@/router/routes/dev'
import Link from '@comp/common/Link.vue'

const route = useRoute()
const atHome = computed(() => route.name === 'home')
const atSearch = computed(() => route.name === 'search')
const atMessage = computed(() => route.name === 'message')
const atMine = computed(() => route.name.includes('mine'))

const isDev = computed(() => import.meta.env.DEV)

const locale = useLocale()

const router = useRouter()
</script>
