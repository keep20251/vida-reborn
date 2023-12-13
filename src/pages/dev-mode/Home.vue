<template>
  <Page>
    <template #default>
      <div class="mt-32 w-full p-8">
        <div class="flex flex-col justify-center gap-4 align-middle">
          <div class="flex justify-center whitespace-nowrap text-3xl font-bold text-purple-300 underline">
            Vida&nbsp;<span class="text-3xl text-purple-500">Development Mode</span>
          </div>
          <div class="flex justify-center whitespace-nowrap text-3xl font-bold text-blue-300 underline">
            Vite&nbsp;<span class="text-3xl text-green-500">{{ renderType }}</span>
          </div>
          <div class="bg-slate-200 text-center">
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
import devRoutes from '@/router/routes/dev'

const renderType = ref('SSR')

onMounted(() => {
  renderType.value = import.meta.env.SSR ? 'SSR' : 'CSR'
})
</script>
