<template>
  <div>
    <List :items="items" item-key="aff">
      <template #default="{ item, index }">
        <div class="flex items-center justify-between py-10">
          <div class="flex items-center">
            <Avatar class="mr-10" :radius="30" :src="item.avatar"></Avatar>
            <div class="leading-md text-base font-bold">{{ item.name }}</div>
          </div>
          <div @click="unblock(index)" class="leading-lg cursor-pointer text-base font-bold text-gray66">
            {{ $t('content.unblock') }}
          </div>
        </div>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-8 text-gray36">
          <Loading></Loading>{{ $t('common.noMore') }}
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

const items = ref([
  { avatar: defaultAvatar, name: 'Cursed_ellie', aff: 1231 },
  { avatar: defaultAvatar, name: 'Cursed_ellie', aff: 1232 },
  { avatar: defaultAvatar, name: 'Cursed_ellie', aff: 1233 },
  { avatar: defaultAvatar, name: 'Cursed_ellie', aff: 1234 },
])

const unblock = (i) => {
  console.log(i)
}
</script>
