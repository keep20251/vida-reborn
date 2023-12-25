<template>
  <header class="flex shrink-0 grow basis-[60px] justify-end overflow-x-hidden md:basis-[72px] xl:basis-[270px]">
    <nav class="fixed flex h-full min-h-[600px] w-[60px] flex-col overflow-x-hidden md:w-[72px] xl:w-[270px]">
      <router-link to="/home">
        <div class="flex items-center justify-center space-x-16 px-12 py-16 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atHome" name="home" size="24"></Icon>
          <Icon v-else name="homeOutline" size="24"></Icon>
          <div class="hidden text-lg xl:block" :class="[atHome ? 'font-bold' : 'font-normal']">
            {{ $t('nav.home') }}
          </div>
        </div>
      </router-link>
      <router-link to="/search">
        <div class="flex items-center justify-center space-x-16 px-12 py-16 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atSearch" name="explore" size="24"></Icon>
          <Icon v-else name="exploreOutline" size="24"></Icon>
          <div class="hidden text-lg xl:block" :class="[atSearch ? 'font-bold' : 'font-normal']">
            {{ $t('nav.search') }}
          </div>
        </div>
      </router-link>
      <router-link to="/message">
        <div class="flex items-center justify-center space-x-16 px-12 py-16 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atMessage" name="message" size="24"></Icon>
          <Icon v-else name="messageOutline" size="24"></Icon>
          <div class="hidden text-lg xl:block" :class="[atMessage ? 'font-bold' : 'font-normal']">
            {{ $t('nav.message') }}
          </div>
        </div>
      </router-link>
      <router-link to="/mine">
        <div class="flex items-center justify-center space-x-16 px-12 py-16 hover:bg-gray05 xl:justify-start">
          <Icon v-if="atMine" name="star" size="24"></Icon>
          <Icon v-else name="starOutline" size="24"></Icon>
          <div class="hidden text-lg xl:block" :class="[atMine ? 'font-bold' : 'font-normal']">
            {{ $t('nav.mine') }}
          </div>
        </div>
      </router-link>
      <div v-if="isDev" class="mt-16 border-spacing-16 border-y border-solid border-gray-500">
        <div class="flex flex-col">
          <router-link
            v-for="route in devRoutes"
            class="font-bold hover:text-green-700"
            :to="route.path"
            :key="route.path"
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
import { useRoute } from 'vue-router'
import devRoutes from '@/router/routes/dev'

const route = useRoute()
const atHome = computed(() => route.name === 'home')
const atSearch = computed(() => route.name === 'search')
const atMessage = computed(() => route.name === 'message')
const atMine = computed(() => route.name === 'mine')

const isDev = computed(() => import.meta.env.DEV)
</script>
