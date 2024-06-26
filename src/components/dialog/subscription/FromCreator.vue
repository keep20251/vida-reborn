<template>
  <div v-if="items.length > 0" class="select-none pb-30 pl-30 pr-10 pt-20">
    <div class="max-h-[65vh] overflow-y-auto" :class="{ 'hover-scrollbar': isDesktop, 'scrollbar pr-15': !isDesktop }">
      <div class="flex flex-col divide-y" :class="{ 'pr-10': isDesktop }">
        <div v-for="(item, index) in items" :key="`subscribe-card-${index}`" class="py-20">
          <SubscribeCard
            :item="item"
            show-contain
            @click="subscribe({ item, creator })"
            @click:contain="onContainClicked"
            :height="260"
          ></SubscribeCard>
        </div>
      </div>
    </div>
  </div>
  <NoData v-else class="p-30 !pt-30"></NoData>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@/components/card/SubscribeCard.vue'
import NoData from '@/components/info/NoData.vue'
import { useDialog } from '@/compositions/modal'

const subscriptionStore = useSubsciptionStore()
const { openDetail } = subscriptionStore
const { items, creator } = storeToRefs(subscriptionStore)
const { subscribe } = useDialog()
const { isDesktop } = storeToRefs(useAppStore())

const onContainClicked = (item) => openDetail({ activeSubscription: item, subscriptions: items.value })
</script>
