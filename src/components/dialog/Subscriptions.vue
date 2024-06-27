<template>
  <div ref="subscriptionRef">
    <BaseDialog v-if="isOpen" size="md" no-padding @click:around="closeFn">
      <template #default>
        <div class="h-full w-full rounded-xl">
          <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
            <div class="text-lg font-bold leading-lg text-white">
              {{ $t('title.subscription') }}
            </div>
            <div class="absolute right-0 top-0 cursor-pointer px-15 pb-10 pt-15" @click="closeFn">
              <Icon name="closeWhite" size="20"></Icon>
            </div>
            <div v-show="isDetail" class="absolute left-0 top-0 cursor-pointer px-15 pb-10 pt-15" @click="back">
              <Icon name="backWhite" size="20"></Icon>
            </div>
          </div>
          <component :is="currentComponent"></component>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>
<script setup>
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubsciptionStore } from '@/store/subscription'
import BaseDialog from './BaseDialog.vue'
import Detail from './subscription/Detail.vue'
import List from './subscription/List.vue'

const store = useSubsciptionStore()
const { isOpen, isFeedSubscription, isList, isDetail } = storeToRefs(store)
const { close, closeFromFeed, back } = store
const closeFn = isFeedSubscription ? closeFromFeed : close
const currentComponent = computed(() => (isList.value ? List : Detail))

const subscriptionRef = ref(null)
watch(isOpen, (v) =>
  v ? disableBodyScroll(subscriptionRef.value) : enableBodyScroll(subscriptionRef.value) && clearAllBodyScrollLocks(),
)
</script>
