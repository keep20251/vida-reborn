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
        <div class="cursor-pointer text-sm text-gray-57" @click="$emit('reply', item)">回覆</div>
        <div class="flex grow justify-end">
          <Icon :name="!!item.like ? 'like' : 'likeOutline'" size="15"></Icon>
        </div>
      </div>

      <!-- 回覆 -->
      <div v-for="reply in replys" class="mb-16 flex space-x-8" :key="reply.id">
        <Avatar :radius="15" :src="reply.author?.thumb"></Avatar>
        <div class="flex min-w-0 grow flex-col space-y-8">
          <div class="text-base font-bold">{{ reply.author?.nickname }}</div>
          <p class="whitespace-pre-wrap break-words text-base leading-lg">
            {{ reply.content }}
          </p>
          <div class="flex">
            <div class="mr-24 text-sm text-gray-57">{{ reply.created_at }}</div>
            <!-- <div class="cursor-pointer text-sm text-gray-57" @click="$emit('reply', item)">回覆</div> -->
            <div class="flex grow justify-end">
              <Icon :name="!!reply.like ? 'like' : 'likeOutline'" size="15"></Icon>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="replys.length < item.reply_num"
        class="mb-16 cursor-pointer text-base text-gray-57"
        @click="nextReplys"
      >
        {{ `查看${item.reply_num - replys.length}則回覆` }}
      </div>
      <Loading v-else-if="isReplysLoading"></Loading>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'
import { useInfinite } from '@use/request/infinite'

const props = defineProps({
  item: { type: Object, required: true },
})

defineEmits(['reply'])

const {
  dataList: replys,
  isLoading: isReplysLoading,
  next: nextReplys,
} = useInfinite('Comment.list', { params: { article_id: props.item.article_id, reply_comment_id: props.item.id } })
</script>
