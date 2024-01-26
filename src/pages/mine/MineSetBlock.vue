<template>
  <div class="items-center border-t pt-10">
    <BlockList></BlockList>
    <!-- <div v-for="(item, index) in items" :key="index" class="flex items-center justify-between">
      <div class="flex items-center">
        <Avatar class="mr-10" :radius="30" :src="item.avatar"></Avatar>
        <div class="leading-md text-base font-bold">{{ item.name }}</div>
      </div>
      <div @click="unblock(index)" class="leading-lg cursor-pointer text-base font-bold text-gray66">
        {{ $t('content.unblock') }}
      </div>
    </div> -->

    <!-- <List :items="items" item-key="id">
      <template #default="{ last }">
        <div class="flex items-center justify-between">
      <div class="flex items-center">
        <Avatar class="mr-10" :radius="30" :src="item.avatar"></Avatar>
        <div class="leading-md text-base font-bold">{{ item.name }}</div>
      </div>
      <div @click="unblock(index)" class="leading-lg cursor-pointer text-base font-bold text-gray66">
        {{ $t('content.unblock') }}
      </div>
    </div>
        <Feed class="py-20"></Feed>
        <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-8 text-gray36">
          <Loading></Loading>{{ $t('common.noMore') }}
        </div>
      </template>
    </List> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
import BlockList from '@comp/mine/BlockList.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const items = ref([
  { avatar: defaultAvatar, name: 'Cursed_ellie' },
  { avatar: defaultAvatar, name: 'Cursed_ellie' },
  { avatar: defaultAvatar, name: 'Cursed_ellie' },
  { avatar: defaultAvatar, name: 'Cursed_ellie' },
])

const unblock = (i) => {
  console.log(i)
}
</script>
