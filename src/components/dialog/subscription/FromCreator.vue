<template>
  <div v-if="items.length > 0" class="select-none p-30">
    <div class="scrollbar-md max-h-[65vh] overflow-y-scroll">
      <div class="flex flex-col divide-y pr-25">
        <div v-for="(item, index) in items" :key="`subscribe-card-${index}`" class="py-20">
          <SubscribeCard :item="item" @click="subscribe({ item, creator })"></SubscribeCard>
        </div>
      </div>
    </div>
  </div>
  <NoData v-else class="p-30 !pt-30"></NoData>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@/components/card/SubscribeCard.vue'
import NoData from '@/components/info/NoData.vue'
import { useDialog } from '@/compositions/modal'

const { items, creator } = storeToRefs(useSubsciptionStore())
const { subscribe } = useDialog()
</script>
