<template>
  <div>
    <List v-if="initLoading" :items="[1, 2, 3, 4]" divider>
      <div class="flex select-none flex-row items-center space-x-10 pb-20 pt-20">
        <div class="h-30 w-30 rounded-full bg-light-gray"></div>
        <div class="h-15 w-1/4 rounded-sm bg-light-gray"></div>
      </div>
    </List>
    <List v-else :items="items" item-key="id" divider>
      <template #default="{ item }">
        <div class="select-none pb-20 pt-20">
          <div class="flex grow items-center justify-between space-x-10">
            <Avatar :radius="15" :src="item?.thumb"></Avatar>
            <div class="flex grow flex-col space-y-5">
              <div class="flex space-x-5">
                <div
                  class="max-w-[6rem] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold leading-md"
                  @click="toCreator(item?.username)"
                >
                  {{ item?.nickname }}
                </div>
                <div
                  class="max-w-[6rem] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-3"
                  @click="toCreator(item?.username)"
                >
                  @{{ item?.username }}
                </div>
              </div>
              <div class="flex items-end space-x-5">
                <div v-if="false" class="text-sm font-normal leading-3 text-gray-57">
                  {{ item?.subscriber_count }} {{ $t('content.subscribers') }}
                </div>
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ item?.post_num }} {{ $t('info.perPost') }}
                </div>
                <div class="text-sm font-normal leading-3 text-gray-57">•</div>
                <div class="text-sm font-normal leading-3 text-gray-57">
                  {{ toKMBTString(item?.view_count) }} {{ $t('content.view') }}
                </div>
              </div>
            </div>
            <Link :href="item?.username" :title="item?.nickname" @click="toCreator(item?.username)">
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
import { onMounted, ref } from 'vue'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import useRequest from '@use/request'
import { useRouters } from '@use/routers'
import { toKMBTString } from '@/utils/string-helper'

const { toCreator } = useRouters()

const items = ref([])
const initLoading = ref(true)

async function fetchCreators() {
  const response = await useRequest('User.searchCreator', { params: { page: 1, limit: 3 }, immediate: true })
  return response.list
}
onMounted(async () => {
  items.value = await fetchCreators()
  initLoading.value = false
})
</script>
