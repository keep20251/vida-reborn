<template>
  <Page>
    <template #default>
      <div>
        <p class="mb-20">{{ content }}</p>
        <div class="flex w-full justify-end">
          <Tab v-model="tabBtn" :options="tabBtnOptions" isBtnTab :isBasicTab="false"></Tab>
        </div>
        <p>{{ tabBtnContent }}</p>
      </div>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'Tab1', value: 1 },
  { label: 'Tab2', value: 2 },
  { label: 'Tab3', value: 3 },
])

const content = computed(() => `目前在 ${tabOptions.value.find((o) => o.value === tab.value).label}`)

const tabBtn = ref(2)
const tabBtnOptions = ref([
  { label: 'Tab1', value: 1 },
  { label: 'Tab2', value: 2 },
  { label: 'Tab3', value: 3 },
])
const tabBtnContent = computed(() => `目前在 ${tabBtnOptions.value.find((o) => o.value === tabBtn.value).label}`)
</script>
