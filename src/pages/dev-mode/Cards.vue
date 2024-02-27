<template>
  <Page>
    <div class="my-10 px-20">
      <div class="mb-10">【 SubscribeCard 】</div>
      <SubscribeCard class="py-30"></SubscribeCard>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10">【 RecCard 】</div>
      <RecCard class="py-30" :items="items"></RecCard>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10 font-bold">【 ViewSubscribeCard 】</div>
      <div class="flex flex-col justify-center space-y-16 py-16 align-middle">
        <ViewSubscribeCard
          v-for="(item, index) in creators"
          :key="`creator-card-${index}`"
          :theme="(index + 2) % 3"
          :item="item"
        ></ViewSubscribeCard>
      </div>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10">【 BulletinCard 】</div>
      <BulletinCard></BulletinCard>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10">【 RelCreatorsCard 】</div>
      <RelCreatorsCard :items="creators"></RelCreatorsCard>
    </div>
    <div class="my-10 flex flex-col space-y-10 px-20">
      <div class="mb-10 font-bold">【 SearchCreatorCard 】</div>
      <SearchCreatorCard v-for="index in 3" :key="`search-card-${index}`"></SearchCreatorCard>
    </div>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import BulletinCard from '@comp/aside/BulletinCard.vue'
import RecCard from '@comp/aside/RecCard.vue'
import RelCreatorsCard from '@comp/aside/RelCreatorsCard.vue'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
import SubscribeCard from '@comp/card/SubscribeCard.vue'
import ViewSubscribeCard from '@comp/card/ViewSubscribeCard.vue'

const items = ref([
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 1,
  },
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 2,
  },
  {
    creator_avatar: null,
    creator_name: 'Cursed_ellie',
    creator_acc: 'cursed_ellie',
    posts: 134,
    sub_member: 1938,
    id: 3,
  },
])

const creators = ref([
  {
    creator_avatar: null,
    creator_name: 'Angelababy',
    creator_username: '＠angelababy',
    creator_posts: 134,
    creator_viewed: 1938,
    creator_info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 1,
  },
  {
    creator_avatar: null,
    creator_name: 'Angelababy',
    creator_username: '＠angelababy',
    creator_posts: 134,
    creator_viewed: 1938,
    creator_info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 2,
  },
  {
    creator_avatar: null,
    creator_name: 'Angelababy',
    creator_username: '＠angelababy',
    creator_posts: 134,
    creator_viewed: 1938,
    creator_info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 3,
  },
])
</script>
