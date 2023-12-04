<template>
  <Page infinite @load="onLoad">
    <template #default>
      <div class="overflow-x-hidden px-20">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="text-gray36 py-8 text-center">載入中.../沒有更多了</div>
          </template>
        </List>
      </div>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #aside>
      <div>
        <div>第一行home aside</div>
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
        <div>最後一行home aside</div>
      </div>
    </template>
    <template #aside-top> Aside Top </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const tab = ref(1)
const tabOptions = ref([
  { label: 'Tab1', value: 1 },
  { label: 'Tab2', value: 2 },
  { label: 'Tab3', value: 3 },
])

function onLoad() {
  console.log('load at', new Date())
}
</script>
