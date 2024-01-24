<template>
  <Page>
    <template #default>{{ devTest }}</template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { onHydration, onServerClientOnce } from '@use/lifecycle'

// 任何可能隨機變動的資料
const devTest = ref(null)

// hydration store
const hydrationStore = useHydrationStore()
const { devTest: devTestFromStore } = storeToRefs(hydrationStore)

onServerClientOnce(async (isSSR) => {
  // 非同步獲取資料
  const v = await new Promise((resolve) => {
    setTimeout(() => resolve(new Date().getTime()), 500)
  })
  devTest.value = v

  if (isSSR) {
    // 若為 SSR 則將隨機變動資料塞進 hydration store 中對應位置
    devTestFromStore.value = v
    console.log('on server', devTest.value)
  } else {
    // 若為 CSR 則自行決定該元件需要執行的流程
    console.log('on client', devTest.value)
  }
})

// hydration 階段將 hydration store 中對應資料還原至對應位置
// 絕對不要在此使用非同步，僅單純的移動資料就好
onHydration(() => {
  devTest.value = devTestFromStore.value
  console.log('on hydration', devTest.value)
})
</script>
