<script setup>
import OfficialFooter from '@comp/layout/official/Footer.vue'
import OfficialHeader from '@comp/layout/official/Header.vue'
</script>

<template>
  <div class="relative flex h-full flex-col">
    <OfficialHeader />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    <OfficialFooter />
  </div>
</template>
