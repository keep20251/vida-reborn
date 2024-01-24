<template>
  <div v-for="(section, index) in accordions" :key="index" class="select-none">
    <div
      class="flex cursor-pointer items-center justify-between space-y-10 rounded-sm bg-slate-200 px-20 py-10"
      @click="toggleSection(index)"
    >
      <div class="text-gray-700">{{ section.title }}</div>
      <Icon name="dropdown" size="8" class="transition-transform" :class="{ 'rotate-180': section.open }"></Icon>
    </div>
    <div
      class="grid space-y-10 bg-slate-100 transition-all"
      :class="[{ 'max-h-[1000px] px-20 py-10': section.open, 'max-h-0': !section.open }]"
    >
      <div v-for="(subItem, subIndex) in section.content" :key="subIndex">
        <div class="flex cursor-pointer justify-between py-4" @click="toggleSubItem(section, subIndex)">
          <div class="text-base font-normal leading-lg text-gray-600" :class="{ hidden: !section.open }">
            {{ subItem.subTitle }}
          </div>
          <Icon
            name="dropdown"
            size="6"
            class="transition-transform"
            :class="{ 'rotate-180': subItem.open, hidden: !section.open }"
          ></Icon>
        </div>
        <div class="px-20 transition-all" :class="[{ 'max-h-[1000px]': subItem.open, 'max-h-0': !subItem.open }]">
          <span
            class="text-sm font-normal leading-md text-gray66 transition-all delay-300"
            :class="{ flex: subItem.open, hidden: !subItem.open || !section.open }"
            >{{ subItem.subContent }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  accordions: { type: Array, required: true },
})

const accordions = ref(props.accordions)

const toggleSection = (index) => {
  accordions.value[index].open = !accordions.value[index].open
}

const toggleSubItem = (section, subIndex) => {
  section.content[subIndex].open = !section.content[subIndex].open
}
</script>
