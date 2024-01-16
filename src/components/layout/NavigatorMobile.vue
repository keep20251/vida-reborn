<template>
  <nav class="fixed bottom-0 flex h-60 w-full bg-white shadow-[0px_-2px_9px_0px_rgba(0,0,0,0.1)]">
    <router-link class="grow" :to="`/${locale}/home`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atHome" name="home" size="20"></Icon>
        <Icon v-else name="homeOutline" size="20"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/search`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atSearch" name="explore" size="20"></Icon>
        <Icon v-else name="exploreOutline" size="20"></Icon>
      </div>
    </router-link>
    <router-link class="grow" to="/">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon name="publish" size="16"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/message`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMessage" name="message" size="20"></Icon>
        <Icon v-else name="messageOutline" size="20"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/mine`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMine" name="star" size="20"></Icon>
        <Icon v-else name="starOutline" size="20"></Icon>
      </div>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@use/utils/i18n'

const route = useRoute()
const atHome = computed(() => route.name === 'home')
const atSearch = computed(() => route.name === 'search')
const atMessage = computed(() => route.name === 'message')
const atMine = computed(() => route.name === 'mine')

const { locale } = useI18n()
</script>
