<template>
  <div class="pb-20 text-lg font-bold leading-[1.125rem]">相关创作者</div>
  <div class="grid gap-y-10">
    <div
      v-for="(item, index) in items"
      :key="itemKey ? item[itemKey] : index"
      class="grid gap-y-10 rounded-[0.625rem] bg-[#7FE2D326] px-20 py-15"
    >
      <div class="flex items-center justify-between">
        <div class="flex">
          <Avatar class="mr-10" :radius="50" :src="item.creator_avatar"></Avatar>
          <div class="flex flex-col gap-y-4">
            <div class="text-lg font-bold leading-[1.125rem]">{{ item.creator_name }}</div>
            <div class="text-sm font-normal leading-[0.75rem] text-gray66">＠{{ item.creator_username }}</div>
            <div class="flex">
              <div class="text-sm font-normal leading-[0.75rem] text-gray66">帖子{{ item.posts }}</div>
              <div class="text-sm font-normal leading-[0.75rem] text-gray66">•</div>
              <div class="text-sm font-normal leading-[0.75rem] text-gray66">{{ item.viewed }} viewed</div>
            </div>
          </div>
        </div>
        <div>
          <Button class="!h-24 !px-18 !py-6 !text-sm !leading-[0.75rem]">查看</Button>
        </div>
      </div>
      <p class="max-w-fit overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal leading-[1.125rem]">
        {{ item.creator_info }}
      </p>
    </div>
  </div>
  <div class="mt-10 flex cursor-pointer items-center justify-center gap-x-5 text-base font-bold leading-[0.875rem]">
    显示更多创作者
    <Icon name="drop" size="12"></Icon>
  </div>
</template>
<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'
import Button from '@comp/common/Button.vue'

defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
})
</script>
