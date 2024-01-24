<template>
  <div>
    <List :items="recCreators" item-key="id">
      <template #default="{ item, last }">
        <div class="border-gray15 pb-20 pt-20" :class="{ 'border-b': !last }">
          <div class="flex grow items-center justify-between space-x-10">
            <Avatar :radius="30" :src="item.creator_avatar"></Avatar>
            <div class="flex grow flex-col space-y-5">
              <div class="flex space-x-5">
                <div class="text-base font-bold leading-md">{{ item.creator_name }}</div>
                <div class="text-sm font-normal leading-3">@{{ item.creator_acc }}</div>
              </div>
              <div class="flex items-end space-x-5">
                <div class="text-sm font-normal leading-3 text-gray66">{{ item.posts }} posts</div>
                <div class="text-sm font-normal leading-3 text-gray66">•</div>
                <div class="text-sm font-normal leading-3 text-gray66">{{ item.sub_member }}位订阅会员</div>
              </div>
            </div>
            <button
              class="flex items-center justify-center rounded-full bg-contrast px-14 py-6 text-sm font-normal leading-3 text-white"
            >
              {{ buttonText }}
            </button>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import List from '@comp/common/List.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

defineProps({
  buttonText: { type: String, default: '查看' },
})

const recCreators = ref([
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 1,
  },
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 2,
  },
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 3,
  },
])
</script>
