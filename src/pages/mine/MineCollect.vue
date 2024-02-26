<template>
  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <component :is="activeComponent" />
</template>
<script setup>
import { computed, ref } from 'vue'
import ColAllPosts from '@comp/mine/ColAllPosts.vue'
import ColNotUnlockedPosts from '@comp/mine/ColNotUnlockedPosts.vue'
import ColUnlockedPosts from '@comp/mine/ColUnlockedPosts.vue'
import Tab from '@comp/navigation/Tab.vue'
import { MINE_COLLECT_TAB } from '@const'

const tab = ref(MINE_COLLECT_TAB.ALL)
const tabOptions = ref([
  { label: 'label.all', value: MINE_COLLECT_TAB.ALL },
  { label: 'label.unlocked', value: MINE_COLLECT_TAB.UNLOCKED },
  { label: 'label.notUnlocked', value: MINE_COLLECT_TAB.NOT_UNLOCKED },
])

const activeComponent = computed(() => {
  switch (tab.value) {
    case MINE_COLLECT_TAB.ALL:
      return ColAllPosts
    case MINE_COLLECT_TAB.UNLOCKED:
      return ColUnlockedPosts
    case MINE_COLLECT_TAB.NOT_UNLOCKED:
      return ColNotUnlockedPosts
    default:
      return ColAllPosts
  }
})
</script>
