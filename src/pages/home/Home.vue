<template>
  <Page>
    <template #default>
      <div class="overflow-x-hidden bg-lime-200">
        <div>Home123321Home123321Home123321Home123321Home123321Home123321Home123321Home123321</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
        <div>Home</div>
      </div>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #aside>
      <div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
      </div>
    </template>
    <template #aside-top> Aside Top </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import Page from '@comp/layout/Page.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'Tab1', value: 1 },
  { label: 'Tab2', value: 2 },
  { label: 'Tab3', value: 3 },
])
</script>
