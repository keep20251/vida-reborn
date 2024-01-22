<template>
  <SelfIntro
    :item="userInfo"
    :cameraIcon="false"
    :showBgData="true"
    :showSubscribePlan="false"
    :showPersonalInfo="true"
  >
    <template #topButton>
      <div class="flex items-center space-x-10">
        <Icon class="cursor-pointer" name="link" size="20"></Icon>
        <Icon class="cursor-pointer" name="setting" size="20"></Icon>
        <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
        <div>
          <Button class="!h-26 !px-20 !py-6">订阅</Button>
        </div>
      </div>
    </template>
    <template #middleButton>
      <div class="cursor-pointer text-sm font-bold leading-3 underline underline-offset-[0.125rem]">
        {{ $t('common.viewSubscribePlan') }}
      </div>
    </template>
  </SelfIntro>
  <div class="mt-20 flex h-36 w-full items-center bg-gray03 px-20 text-base font-bold leading-md">All Posts 85</div>
  <div class="overflow-x-hidden">
    <List :items="items" item-key="id">
      <template #default="{ last }">
        <Feed class="py-20"></Feed>
        <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-8 text-gray36">
          <Loading></Loading> {{ $t('common.loading') }}
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Button from '@comp/common/Button.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const userInfo = ref({
  avatar: defaultAvatar,
  name: 'Angelababy',
  username: 'angelababy',
  subscriber: 364,
  posts: 85,
  link: 'WenHsin.com',
  viewed: 2532,
  info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
})

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
