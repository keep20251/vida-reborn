<template>
  <div class="flex h-full w-full flex-row justify-center">
    <Navigator></Navigator>
    <router-view></router-view>
  </div>
</template>

<script setup>
import Navigator from '@/components/layout/Navigator.vue'
</script>
