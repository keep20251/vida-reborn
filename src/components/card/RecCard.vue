<template>
  <div>
    <List :items="items" item-key="id" divider>
      <template #default="{ item }">
        <div class="select-none pb-20 pt-20">
          <div class="flex grow items-center justify-between space-x-10">
            <Avatar :radius="15" :src="item?.thumb"></Avatar>
            <div class="flex grow flex-col space-y-5">
              <div class="flex space-x-5">
                <div class="text-base font-bold leading-md">{{ item?.nickname }}</div>
                <div class="text-sm font-normal leading-3">@{{ item?.username }}</div>
              </div>
              <div class="flex items-end space-x-5">
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item?.subscriber_count }} {{ $t('content.subscribers') }}
                </div>
                <div class="text-sm font-normal leading-3 text-gray-57">•</div>
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item?.view_count }} {{ $t('content.view') }}
                </div>
              </div>
            </div>
            <Link :href="`/${item?.username}`" :title="item?.nickname" @click="toCreator(item?.username)">
              <button
                class="flex items-center justify-center rounded-full bg-contrast px-14 py-6 text-sm font-normal leading-3 text-white"
              >
                {{ $t('common.check') }}
              </button>
            </Link>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'

const { toCreator } = useRouters()

defineProps({
  items: {
    type: Array,
    default: () => [
      {
        background: null,
        thumb: null,
        nickname: 'Angelababy',
        username: '@angelababy',
        description: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me <3, I'm convinced.`,
        subscriber_count: 10,
        view_count: 10,
      },
    ],
  },
})
</script>
