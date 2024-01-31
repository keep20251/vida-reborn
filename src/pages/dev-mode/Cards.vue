<template>
  <Page>
    <div class="my-10 px-20">
      <div class="mb-10">【 Creator Recommended Card 】</div>
      <RecCard class="py-30" :items="items"></RecCard>
    </div>
    <div class="my-10 px-20">
      <div class="mb-10 font-bold">【 漸層版查看創作者卡片 】</div>
      <div class="flex flex-col justify-center space-y-16 py-16 align-middle">
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
    <div class="my-10 px-20">
      <div class="mb-10">【 Related Creators Card 】</div>
      <RelCreatorsCard :items="creators"></RelCreatorsCard>
    </div>
    <div class="my-10 flex flex-col space-y-10 px-20">
      <div class="mb-10 font-bold">【 搜索頁面用的創作者卡片 】</div>
      <SearchCreatorCard v-for="index in 3" :key="`search-card-${index}`"></SearchCreatorCard>
    </div>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RecCard from '@comp/card/RecCard.vue'
import RelCreatorsCard from '@comp/card/RelCreatorsCard.vue'
import SearchCreatorCard from '@comp/card/SearchCreatorCard.vue'
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
