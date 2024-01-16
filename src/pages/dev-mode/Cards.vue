<template>
  <Page>
    <div class="my-10 px-20">
      <div class="mb-10">【 Creator Recommended Card 】</div>
      <RecCard class="py-30" :items="items"></RecCard>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10">【 Creator Card 】</div>
      <div class="flex flex-col justify-center gap-y-16 px-16 py-16 align-middle">
        <ViewSubscribeCard
          v-for="index in 3"
          :key="`creator-card-${index}`"
          :theme="(index + 2) % 3"
        ></ViewSubscribeCard>
      </div>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10">【 Bulletin Card 】</div>
      <BulletinCard></BulletinCard>
    </div>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import RecCard from '@comp/card/RecCard.vue'
import ViewSubscribeCard from '@/components/card/ViewSubscribeCard.vue'
import BulletinCard from '@comp/card/BulletinCard.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const items = ref([
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
