<template>
  <div class="mb-16 flex space-x-8">
    <Avatar :radius="15" :src="item.author?.thumb"></Avatar>
    <div class="flex min-w-0 grow flex-col space-y-8">
      <div class="text-base font-bold">{{ item.author?.nickname }}</div>
      <p class="whitespace-pre-wrap break-words text-base leading-lg">
        {{ item.content }}
      </p>
      <div class="flex">
        <div class="mr-24 text-sm text-gray-57">{{ item.created_at }}</div>
        <div class="text-sm text-gray-57">回覆</div>
        <div class="flex grow justify-end">
          <Icon :name="!!item.like ? 'like' : 'likeOutline'" size="15"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'

defineProps({
  item: { type: Object, required: true },
})
</script>
