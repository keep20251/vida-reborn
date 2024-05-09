<template>
  <header class="flex shrink-0 grow basis-60 justify-end overflow-x-hidden md:basis-72 xl:basis-[150px]">
    <nav class="fixed flex h-full min-h-[600px] w-60 flex-col overflow-x-hidden md:w-72 xl:w-[150px]">
      <Link class="mt-10 px-12 pb-20 pt-10 hover:bg-gray-f6" href="/home" title="VIDA" @click="reload">
        <img class="h-20 w-36 xl:h-40 xl:w-72" src="@/assets/logo.svg?url" alt="VIDA" />
      </Link>
      <router-link to="/home">
        <div
          class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray-f6 xl:justify-start"
          @click="checkHomeAgain"
        >
          <Icon v-if="atHome" name="home" size="30"></Icon>
          <Icon v-else name="homeOutline" size="30"></Icon>
          <div class="hidden text-base xl:block" :class="[atHome ? 'font-bold' : 'font-normal']">
            {{ $t('nav.home') }}
          </div>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray-f6 xl:justify-start">
          <Icon v-if="atSearch" name="search" size="30"></Icon>
          <Icon v-else name="searchOutline" size="30"></Icon>
          <div class="hidden text-base xl:block" :class="[atSearch ? 'font-bold' : 'font-normal']">
            {{ $t('nav.search') }}
          </div>
        </div>
      </router-link>
      <Link href="/message" @click="toMessage">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray-f6 xl:justify-start">
          <Icon v-if="atMessage" name="message" size="30"></Icon>
          <Icon v-else name="messageOutline" size="30"></Icon>
          <div class="hidden text-base xl:block" :class="[atMessage ? 'font-bold' : 'font-normal']">
            {{ $t('nav.message') }}
          </div>
        </div>
      </Link>
      <router-link to="/mine">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray-f6 xl:justify-start">
          <Icon v-if="atMine" name="mine" size="30"></Icon>
          <Icon v-else name="mineOutline" size="30"></Icon>
          <div class="hidden text-base xl:block" :class="[atMine ? 'font-bold' : 'font-normal']">
            {{ $t('nav.mine') }}
          </div>
        </div>
      </router-link>
      <Link href="/publish" @click="onPublishClick">
        <div class="flex items-center justify-center space-x-20 px-12 py-10 hover:bg-gray-f6 xl:justify-start">
          <Icon name="publish2" size="30"></Icon>
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
            :to="`/devmode/${route.name.substring('devmode-'.length)}`"
            :key="route.name"
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
import Link from '@comp/common/Link.vue'
import { useNavigator } from '@use/navigator'
import { useRouters } from '@use/routers'
import devRoutes from '@/router/routes/dev'

const { atHome, atSearch, atMessage, atMine, toMessage, onPublishClick, checkHomeAgain } = useNavigator()
const { reload } = useRouters()

const isDev = computed(() => import.meta.env.DEV)
</script>
