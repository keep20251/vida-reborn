<template>
  <Page>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'Tab1', value: 1 },
  { label: 'Tab2', value: 2 },
  { label: 'Tab3', value: 3 },
])
</script>
