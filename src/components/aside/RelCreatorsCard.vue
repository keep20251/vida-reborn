<template>
  <div class="scrollbar-md max-h-[25rem] overflow-auto p-10">
    <div class="pb-20 text-lg font-bold leading-lg">{{ $t('label.relCreators') }}</div>
    <div>
      <List :items="dataList" item-key="id">
        <template #default="{ item }">
          <div class="mb-10 grid w-full select-none space-y-10 rounded-md bg-[#7FE2D326] px-20 py-15">
            <div class="flex items-start justify-between">
              <div class="flex">
                <Avatar class="mr-10" :radius="25" :src="item.thumb"></Avatar>
                <div class="flex flex-col space-y-4">
                  <div
                    class="max-w-[6.25rem] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-lg"
                  >
                    {{ item.nickname }}
                  </div>
                  <div
                    class="max-w-[6.25rem] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-3 text-gray-57"
                  >
                    ＠{{ item.username }}
                  </div>
                  <div class="flex">
                    <div class="max-w-[3rem] overflow-hidden text-ellipsis text-sm font-normal leading-3 text-gray-57">
                      {{ item.post_num }}<span class="pl-1">{{ $t('content.posts') }}</span>
                    </div>
                    <div class="mx-2 text-sm font-normal leading-3 text-gray-57">•</div>
                    <div class="max-w-[3rem] overflow-hidden text-ellipsis text-sm font-normal leading-3 text-gray-57">
                      {{ item.view_count }}<span class="pl-1">{{ $t('content.view') }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link :href="item?.username" :title="item?.nickname" @click="toCreator(item?.username)">
                <Button class="!h-24 !px-18 !py-6 !text-sm !leading-3">
                  <span class="max-w-[2.5rem] overflow-hidden text-ellipsis">{{ $t('common.check') }}</span>
                </Button>
              </Link>
            </div>
            <p class="max-w-fit overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal leading-lg">
              {{ item.description }}
            </p>
          </div>
        </template>
        <template #bottom>
          <div
            class="flex cursor-pointer items-center justify-center space-x-5 text-base font-bold leading-md"
            @click="next"
          >
            <Loading v-if="isLoading"></Loading>
            <div v-else>
              <div v-if="noMore">{{ $t('common.noMore') }}</div>
              <div v-else>
                {{ $t('content.showMoreCreators') }}
                <Icon name="drop" size="12"></Icon>
              </div>
            </div>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import Button from '@comp/common/Button.vue'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useInfinite } from '@use/request/infinite'
import { useRouters } from '@use/routers'

const { toCreator } = useRouters()

const { dataList, isLoading, noMore, init, next } = useInfinite('User.searchCreator', { limit: 3 })

onMounted(async () => {
  init()
})
</script>
