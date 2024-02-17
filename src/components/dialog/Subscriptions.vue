<template>
  <BaseDialog no-padding @click:around="close">
    <template #default>
      <div class="h-full w-full rounded-xl">
        <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
          <div class="text-lg font-bold leading-lg text-white">
            {{ $t('title.subscription') }}
          </div>
          <div class="absolute right-0 top-0 cursor-pointer pr-15 pt-15">
            <Icon name="closeWhite" size="20" @click="close"></Icon>
          </div>
        </div>
        <div class="select-none px-30 py-20">
          <div class="scrollbar-md max-h-[65vh] overflow-y-scroll">
            <div class="flex flex-col divide-y pr-25">
              <div v-for="(item, index) in items" :key="`subscribe-card-${index}`" class="py-20">
                <SubscribeCard :item="item" @click="subscribe(item)"></SubscribeCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import SubscribeCard from '@comp/card/SubscribeCard.vue'
import { useDialog } from '@use/modal'
import BaseDialog from './BaseDialog.vue'

const store = useSubsciptionStore()
const { close } = store
const { items } = storeToRefs(store)

const { subscribe } = useDialog()
</script>
