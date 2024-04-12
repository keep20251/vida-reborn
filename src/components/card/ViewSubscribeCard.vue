<template>
  <div class="relative h-[11rem]">
    <div v-if="props.item?.background" class="h-full w-full">
      <EncryptImage :src="props.item?.background" :border-radius="15" cover></EncryptImage>
    </div>
    <div class="absolute top-0 h-full w-full rounded-xl opacity-80" :class="colorTheme">
      <div class="h-full w-full cursor-pointer px-20 py-30" @click="toCreator(item.username)">
        <div class="flex h-full pl-80">
          <div class="flex w-2/5 grow flex-col space-y-10">
            <div>
              <div class="line-clamp-1 text-lg font-bold leading-5">{{ props.item?.nickname }}</div>
              <div class="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-3 text-gray-57">
                @{{ props.item?.username }}
              </div>
            </div>
            <div class="line-clamp-2 text-base font-normal leading-5">
              {{ props.item?.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute left-20 top-30 flex-shrink-0">
      <Avatar :radius="35" :src="props.item?.thumb" :alt="props.item?.username"></Avatar>
    </div>
    <div class="absolute bottom-20 right-20 flex-shrink-0 self-end" @click.stop>
      <Button :size="size" @click="open({ items: item?.subscription_list, creator: item })">{{
        $t('common.viewSubscribePlan')
      }}</Button>
    </div>
    <!-- 暫隱藏 -->
    <!-- <div class="absolute right-20 top-20 cursor-pointer">
      <Icon name="closeWhite" size="20"></Icon>
    </div> -->
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSubsciptionStore } from '@/store/subscription'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'

const props = defineProps({
  item: {
    type: Object,
  },
  theme: {
    type: Number,
    default: 0,
  },
})

const colorTheme = computed(() => {
  switch (props.theme) {
    case 2:
      return 'bg-gradient-to-b from-gray-brown from-[6.82%] to-gray-cyan to-[98.84%]'
    case 1:
      return 'bg-gradient-to-b from-gray-pink from-[0%] to-gray-brown to-[100%]'
    case 0:
    default:
      return 'bg-gradient-to-b from-gray-purple from-[6.82%] to-gray-orange to-[98.84%]'
  }
})

const { isMobile } = storeToRefs(useAppStore())
const size = computed(() => (isMobile.value ? 'md' : 'lg'))

const { toCreator } = useRouters()

const { open } = useSubsciptionStore()
</script>
