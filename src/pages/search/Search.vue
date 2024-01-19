<template>
  <Page>
    <template #main-top>
      <div class="flex h-full items-center">
        <InputWrap
          class="grow"
          v-model="inputValue"
          :placeholder="'搜索...'"
          :appendIcon="'search2'"
          @click:append="console.log('appendIcon')"
        ></InputWrap>
      </div>
    </template>
    <template #default>
      <div class="overflow-x-hidden">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray36">
              <Loading></Loading>{{ $t('common.noMore') }}
            </div>
          </template>
        </List>
      </div>
    </template>
    <template #aside>
      <ClientOnly>
        <div>
          <RelCreatorsCard :items="creators"></RelCreatorsCard>
          <BulletinCard class="mt-20"></BulletinCard>
          <Carousel class="mt-30" :items="cats" :intervalTime="true"></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import InputWrap from '@comp/form/InputWrap.vue'
import { ref } from 'vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import BulletinCard from '@comp/card/BulletinCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import RelCreatorsCard from '@comp/card/RelCreatorsCard.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import ClientOnly from '@/components/common/ClientOnly'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
const inputValue = ref('')
const cats = ref([
  { img: 'https://i.postimg.cc/3RTHR6kh/4edca499dd436a67fa25e5fbf3cb5582.png' },
  { img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
  { img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg' },
  { img: 'https://images.pexels.com/photos/3054570/pexels-photo-3054570.jpeg' },
  { img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg' },
  { img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg' },
])

const creators = ref([
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Angelababy',
    creator_username: '＠angelababy',
    creator_posts: 134,
    creator_viewed: 1938,
    creator_info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 1,
  },
  {
    creator_avatar: defaultAvatar,
    creator_name: 'Angelababy',
    creator_username: '＠angelababy',
    creator_posts: 134,
    creator_viewed: 1938,
    creator_info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
    id: 2,
  },
  {
    creator_avatar: defaultAvatar,
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
