<template>
  <div class="px-20">
    <div
      class="relative mb-35 flex h-[180px] w-full bg-gray66 bg-[url(https://i.postimg.cc/2yKgNXvn/ctrateBg.jpg)] bg-cover bg-center bg-no-repeat"
    >
      <div class="absolute left-1/2 top-1/2 w-full translate-x-[-50%] translate-y-[-50%]">
        <div class="flex justify-around">
          <div class="flex w-[175px] flex-col items-center gap-y-5">
            <p class="text-xl font-bold leading-[1.5625rem] text-white">35K</p>
            <p class="text-sm font-normal leading-[0.75rem] text-white opacity-50">Subscribers</p>
          </div>
          <div class="h-25 w-1 bg-[#DCDCDC]"></div>
          <div class="flex w-[175px] flex-col items-center gap-y-5">
            <p class="text-xl font-bold leading-[1.5625rem] text-white">85</p>
            <p class="text-sm font-normal leading-[0.75rem] text-white opacity-50">Posts</p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-[-35px] flex h-70 w-full px-20">
        <Avatar :radius="70" :src="defaultAvatar"></Avatar>
      </div>
      <div class="absolute bottom-[-45px] right-0 flex w-full justify-end pl-20">
        <div class="flex items-center gap-x-10">
          <Icon class="cursor-pointer" name="link" size="20"></Icon>
          <router-link :to="{ name: 'mine-profile-set' }" class="flex items-center">
            <Icon class="cursor-pointer" name="setting" size="20"></Icon>
          </router-link>
          <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
        </div>
      </div>
    </div>
    <div class="grid gap-y-10 pt-30">
      <div class="flex items-end gap-x-5">
        <div class="text-lg font-bold leading-[1.125rem]">Angelababy</div>
        <div class="text-sm font-normal leading-[0.75rem] text-gray66">＠angelababy</div>
      </div>
      <div class="flex items-end gap-x-5">
        <div class="text-sm font-normal leading-[0.75rem]">My Links:</div>
        <div class="text-sm font-normal leading-[0.75rem] text-gray66">WenHsin.com</div>
        <div class="text-sm font-normal leading-[0.75rem] text-gray66">•</div>
        <div class="text-sm font-normal leading-[0.75rem] text-gray66">143.2k viewed</div>
      </div>
      <p class="text-base font-normal leading-[1.125rem]">
        🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦
      </p>
    </div>
    <div class="my-20 flex gap-x-10">
      <Button class="w-full">订阅设置</Button>
      <Button contrast class="text-nowrap">预览</Button>
    </div>
    <div class="flex h-36 w-full items-center bg-gray03 px-20 text-base font-bold leading-[0.875rem]">All Posts 85</div>
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
  </div>
</template>
<script setup>
import { ref } from 'vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Button from '@comp/common/Button.vue'
import Loading from '@comp/common/Loading.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
