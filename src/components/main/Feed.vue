<template>
  <div class="flex w-full flex-col space-y-10">
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <Avatar :radius="30" class="mr-5" :src="defaultAvatar"></Avatar>
      <div class="grow text-base font-bold leading-none">{{ props.item.nickname }}</div>
      <div class="grow text-right text-sm font-medium leading-5 text-gray66">{{ props.item.postTime }} minutes</div>
      <Icon name="moreVertical" size="20"></Icon>
    </div>

    <!-- media -->
    <div>
      <div class="w-full rounded-md bg-orange-100">
        <div class="pt-[60%]"></div>
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-20">
      <div class="flex grow space-x-10">
        <Icon name="likeOutline" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.likes }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.comments }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.shares }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.views }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="collection" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ props.item.collections }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ props.item.title }}</div>
      <div class="flex items-end space-x-5">
        <div>
          <div class="flex space-x-5">
            <div
              v-for="(tag, index) in props.item.tags"
              :key="`tag-${index}`"
              class="text-base leading-lg text-primary"
            >
              #{{ tag }}
            </div>
          </div>
          <div class="text-base leading-lg">
            {{ props.item.content }}
          </div>
        </div>
        <div class="text-base leading-lg text-gray66">more</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      nickname: 'Angelababy',
      postTime: '6',
      likes: '113',
      comments: '289',
      shares: '94',
      views: '23,000',
      collections: '94',
      title: 'Hello, New Followers!',
      tags: ['黑丝', '写真'],
      content: 'Thank you so much for joining my Fansly! ❤️ Throw back ❤️ DM me! Hello everyone, this is...',
    }),
  },
})
</script>
