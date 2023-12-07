<template>
  <div class="flex h-full w-full flex-row justify-center" id="main">
    <Navigator></Navigator>
    <router-view></router-view>
  </div>
  <!-- <NavigatorMobile></NavigatorMobile> -->
</template>

<script setup>
import Navigator from '@/components/layout/Navigator.vue'
// import NavigatorMobile from '@/components/layout/NavigatorMobile.vue'
</script>
