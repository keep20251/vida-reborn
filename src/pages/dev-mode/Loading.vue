<template>
  <Page>
    <div class="flex flex-col justify-center pl-32">
      <div class="flex items-center space-x-16 py-8">rate: 0.1<Loading :rate="0.1"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.2<Loading :rate="0.2"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.3<Loading :rate="0.3"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.4<Loading :rate="0.4"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.5<Loading :rate="0.5"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.6<Loading :rate="0.6"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.7<Loading :rate="0.7"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.8<Loading :rate="0.8"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 0.9<Loading :rate="0.9"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: 1.0<Loading :rate="1.0"></Loading></div>
      <div class="flex items-center space-x-16 py-8">rate: none<Loading></Loading></div>
      <div class="flex items-center space-x-16 py-8">
        Loading Dotted
        <LoadingDotted size="40"></LoadingDotted>
      </div>
    </div>
  </Page>
</template>

<script setup>
import LoadingDotted from '@/components/common/LoadingDotted.vue'
</script>
