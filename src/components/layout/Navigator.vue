<template>
  <header class="flex justify-end grow basis-[60px] shrink-0 md:basis-[72px] xl:basis-[270px] overflow-x-hidden">
    <nav class="flex flex-col w-[60px] md:w-[72px] xl:w-[270px] min-h-[600px] bg-fuchsia-200">
      <router-link to="/home">Home</router-link>
      <router-link to="/search">Search</router-link>
      <router-link to="/message">Message</router-link>
      <router-link to="/mine">Mine</router-link>
      <div v-if="isDev" class="mt-16 border-y border-spacing-16 border-solid border-gray-500">
        <div class="flex flex-col">
          <router-link class="hover:text-green-700 font-bold" to="/devmode/home">Home</router-link>
          <router-link class="hover:text-green-700 font-bold" to="/devmode/i18n">i18n</router-link>
          <router-link class="hover:text-green-700 font-bold" to="/devmode/pinia">Pinia</router-link>
          <router-link class="hover:text-green-700 font-bold" to="/devmode/icons">Icons</router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { computed } from 'vue'

const isDev = computed(() => import.meta.env.DEV)
</script>
