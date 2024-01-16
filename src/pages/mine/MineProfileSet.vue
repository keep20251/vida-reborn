<template>
  <div class="flex flex-col gap-y-20">
    <div
      class="relative mb-35 flex h-[180px] w-full bg-gray66 bg-[url(https://i.postimg.cc/2yKgNXvn/ctrateBg.jpg)] bg-cover bg-center bg-no-repeat"
    >
      <div class="absolute flex h-full w-full items-center justify-center">
        <div class="text-sm font-normal leading-3 text-white">點擊上傳背景圖</div>
      </div>
      <div class="absolute bottom-[-35px] flex h-70 w-full px-20">
        <Avatar :radius="70" :src="defaultAvatar" camera-icon></Avatar>
      </div>
    </div>
    <div class="flex flex-col gap-y-20 pl-4">
      <InputWrap label="Display Name"></InputWrap>
      <div class="flex flex-col gap-y-11">
        <InputWrap label="Username"></InputWrap>
        <p class="text-sm font-normal leading-3 text-slate-600">
          Your public profile will be <span class="text-black">Vida.pub/username</span>
        </p>
      </div>
      <InputWrap label="Description"></InputWrap>
      <div class="flex flex-col gap-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">Social Media Link</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary">Edit</p>
        </div>
        <SocialLink
          v-for="link in testSocialLinks"
          :key="`social-link-${link.icon}`"
          :icon="link.icon"
          :url="link.url"
        ></SocialLink>
      </div>
      <div class="flex flex-col gap-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">Social Media Link</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary">訂閱設置</p>
        </div>
        <SubscribeSwitch
          v-for="(sub, index) in testSubscriptions"
          :key="`sub-${index}`"
          v-model="sub.isOpen"
          :title="sub.title"
          :price="sub.price"
        ></SubscribeSwitch>
      </div>
    </div>
  </div>
</template>
<script setup>
import Avatar from '@/components/multimedia/Avatar.vue'
import InputWrap from '@/components/form/InputWrap.vue'
import SocialLink from '@/components/form/SocialLink.vue'
import SubscribeSwitch from '@/components/form/SubscribeSwitch.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import { ref } from 'vue'

const testSocialLinks = [
  { icon: 'socialInstagram', url: 'https://www.instagram.com/abc123' },
  { icon: 'socialFacebook', url: 'https://www.facebook.com/abc123' },
  { icon: 'socialYoutube', url: 'https://www.youtube.com/abc123' },
  { icon: 'socialTwitter', url: 'https://www.twitter.com/abc123' },
  { icon: 'socialTiktok', url: 'https://www.tiktok.com/abc123' },
]

const testSubscriptions = ref([
  { title: '一般會員', price: 9, isOpen: false },
  { title: '黃金會員', price: 99, isOpen: false },
  { title: '白金會員', price: 999, isOpen: false },
  { title: '鑽石會員', price: 9999, isOpen: false },
])
</script>
