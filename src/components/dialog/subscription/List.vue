<template>
  <component :is="currentComponent"></component>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import FromCreator from './FromCreator.vue'
import FromFeed from './FromFeed.vue'

const { isFeedSubscription } = storeToRefs(useSubsciptionStore())
const currentComponent = computed(() => (isFeedSubscription.value ? FromFeed : FromCreator))
</script>
