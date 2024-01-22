<template>
  <div class="items-center space-y-10 border-t pt-20">
    <div v-for="(item, index) in items" :key="index" class="flex items-center justify-between">
      <div class="flex items-center">
        <Avatar class="mr-10" :radius="30" :src="item.avatar"></Avatar>
        <div class="leading-md text-base font-bold">{{ item.name }}</div>
      </div>
      <div @click="unblock(index)" class="leading-lg cursor-pointer text-base font-bold text-gray66">Unblock</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import Avatar from '@comp/multimedia/Avatar.vue'

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
