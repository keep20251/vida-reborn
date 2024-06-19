<template>
  <BaseDialog v-if="isOpen" size="md" no-padding @click:around="closeFn">
    <template #default>
      <div class="h-full w-full rounded-xl">
        <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
          <div class="text-lg font-bold leading-lg text-white">
            {{ $t('title.subscription') }}
          </div>
          <div class="absolute right-0 top-0 cursor-pointer pr-15 pt-15">
            <Icon name="closeWhite" size="20" @click="closeFn"></Icon>
          </div>
        </div>
        <component :is="currentComponent"></component>
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import BaseDialog from './BaseDialog.vue'
import FromCreator from './subscription/FromCreator.vue'
import FromFeed from './subscription/FromFeed.vue'

const store = useSubsciptionStore()
const { isOpen, isFeedSubscription } = storeToRefs(store)
const { close, closeFromFeed } = store
const closeFn = isFeedSubscription ? closeFromFeed : close
const currentComponent = computed(() => (isFeedSubscription.value ? FromFeed : FromCreator))
</script>
