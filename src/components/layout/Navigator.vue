<template>
  <header class="flex shrink-0 grow basis-[60px] justify-end overflow-x-hidden md:basis-[72px] xl:basis-[270px]">
    <nav
      class="fixed flex h-full min-h-[600px] w-[60px] flex-col overflow-auto bg-fuchsia-200 md:w-[72px] xl:w-[270px]"
    >
      <router-link to="/home">Home</router-link>
      <router-link to="/search">Search</router-link>
      <router-link to="/message">Message</router-link>
      <router-link to="/mine">Mine</router-link>
      <div v-if="isDev" class="mt-16 border-spacing-16 border-y border-solid border-gray-500">
        <div class="flex flex-col">
          <router-link
            v-for="route in devRoutes"
            class="font-bold hover:text-green-700"
            :to="route.path"
            :key="route.path"
            >{{ route.name }}</router-link
          >
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { computed } from 'vue'
import { devRoutes } from '@/router/routes/dev'

const isDev = computed(() => import.meta.env.DEV)
</script>
