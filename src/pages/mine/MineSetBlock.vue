<template>
  <div class="items-center space-y-10 border-t pt-20">
    <div v-for="(item, index) in items" :key="index" class="flex items-center justify-between">
      <div class="flex items-center">
        <Avatar class="mr-10" :radius="30" :src="item.avatar"></Avatar>
        <div class="text-base font-bold leading-md">{{ item.name }}</div>
      </div>
      <div @click="unblock(index)" class="cursor-pointer text-base font-bold leading-lg text-gray66">Unblock</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
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
