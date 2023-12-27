<template>
  <div v-for="(section, index) in accordions" :key="index" class="select-none">
    <div
      class="flex cursor-pointer items-center justify-between gap-y-10 rounded-sm bg-slate-200 px-20 py-10"
      @click="toggleSection(index)"
    >
      <div class="text-gray-700">{{ section.title }}</div>
      <Icon
        name="back"
        size="12"
        class="rotate-[270deg] transition-transform"
        :class="{ 'rotate-90': section.open }"
      ></Icon>
    </div>
    <div
      v-if="section.open"
      class="transition-max-h grid max-h-full gap-y-10 bg-slate-100 px-20 py-10 duration-1000 ease-in-out"
    >
      <div v-for="(subItem, subIndex) in section.content" :key="subIndex">
        <div class="flex cursor-pointer justify-between py-4" @click="toggleSubItem(section, subIndex)">
          <div class="text-[0.875rem] font-normal leading-[1.125rem] text-gray-600">
            {{ subItem.subTitle }}
          </div>
          <Icon
            name="back"
            size="10"
            class="rotate-[270deg] transition-transform"
            :class="{ 'rotate-90': subItem.open }"
          ></Icon>
        </div>
        <div v-if="subItem.open" class="transition-max-h max-h-full px-20 duration-1000 ease-in-out">
          <span class="leading-[0.75rem text-[0.75rem] font-normal text-gray66">{{ subItem.subContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

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
