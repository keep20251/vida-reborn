<template>
  <Page>
    <template #default>
      <div class="mt-32 p-8 w-full">
        <div class="flex flex-col gap-4 justify-center align-middle">
          <div class="text-3xl font-bold underline text-purple-300 whitespace-nowrap flex justify-center">
            Vida&nbsp;<span class="text-3xl text-purple-500">Development Mode</span>
          </div>
          <div class="text-3xl font-bold underline text-blue-300 whitespace-nowrap flex justify-center">
            Vite&nbsp;<span class="text-3xl text-green-500">{{ renderType }}</span>
          </div>
          <div class="text-center bg-slate-200">
            <div v-for="route in devRoutes" :key="`dev-route-${route.name}`">
              <router-link v-if="route.name && !route.name.includes(`home`)" :to="route.path">
                <div class="text-xl text-green-600">{{ route.name }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { devRoutes } from '@/router/routes/dev'
import Page from '@/components/layout/Page.vue'

const renderType = ref('SSR')

onMounted(() => {
  renderType.value = import.meta.env.SSR ? 'SSR' : 'CSR'
})
</script>
