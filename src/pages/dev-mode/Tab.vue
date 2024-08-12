<template>
  <Page>
    <template #default>
      <div class="flex flex-col space-y-20">
        <div>
          <p class="mb-20">{{ content }}</p>
          <div class="flex w-full justify-end">
            <ButtonTab v-model="tabBtn" :options="tabBtnOptions" btn-style></ButtonTab>
          </div>
          <p>{{ tabBtnContent }}</p>
        </div>
        <div class="max-w-lg">
          <p class="mb-16">Tag Swiper 測試</p>
          <TagSwiper
            v-model="swiperIndex"
            :items="swiperOptions"
            item-value="value"
            item-label="label"
            item-active="active"
          ></TagSwiper>
        </div>
      </div>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref } from 'vue'
import ButtonTab from '@comp/navigation/ButtonTab.vue'
import Tab from '@comp/navigation/Tab.vue'
import TagSwiper from '@/components/common/TagSwiper.vue'

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

const swiperIndex = ref(0)
const swiperOptions = ref([
  { label: '我推的孩子', value: 0, active: true },
  { label: '葬送的芙莉蓮', value: 1, active: true },
  { label: '鬼滅之刃', value: 2, active: true },
  { label: '咒術迴戰', value: 3, active: false },
  { label: '我的英雄學院', value: 4, active: true },
  { label: '間諜家家酒', value: 5, active: true },
  { label: '派對咖孔明', value: 6, active: true },
  { label: '我獨自升級', value: 7, active: true },
  { label: '天官賜福', value: 8, active: true },
  { label: '鏈鋸人', value: 9, active: true },
])
</script>
