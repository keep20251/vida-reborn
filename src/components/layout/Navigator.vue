<template>
  <header class="flex shrink-0 grow basis-[60px] justify-end overflow-x-hidden md:basis-[72px] xl:basis-[270px]">
    <nav class="flex min-h-[600px] w-[60px] flex-col bg-fuchsia-200 md:w-[72px] xl:w-[270px]">
      <router-link to="/home">Home</router-link>
      <router-link to="/search">Search</router-link>
      <router-link to="/message">Message</router-link>
      <router-link to="/mine">Mine</router-link>
      <div v-if="isDev" class="mt-16 border-spacing-16 border-y border-solid border-gray-500">
        <div class="flex flex-col">
          <router-link class="font-bold hover:text-green-700" to="/devmode/home">Home</router-link>
          <router-link class="font-bold hover:text-green-700" to="/devmode/i18n">i18n</router-link>
          <router-link class="font-bold hover:text-green-700" to="/devmode/pinia">Pinia</router-link>
          <router-link class="font-bold hover:text-green-700" to="/devmode/icons">Icons</router-link>
          <router-link class="font-bold hover:text-green-700" to="/devmode/cookie">Cookie</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { computed } from 'vue'

const isDev = computed(() => import.meta.env.DEV)
</script>
