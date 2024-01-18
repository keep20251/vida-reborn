<template>
  <div class="flex flex-col space-y-20">
    <SelfIntro
      :item="userInfo"
      :cameraIcon="true"
      :showBgData="false"
      :showSubscribePlan="false"
      :showPersonalInfo="false"
      :showBgUpload="true"
      :showAllInfo="false"
    >
    </SelfIntro>
    <div class="flex flex-col space-y-20 pl-4">
      <InputWrap :label="$t('label.displayName')" :placeholder="$t('placeholder.displayName')"></InputWrap>
      <div class="flex flex-col space-y-11">
        <InputWrap :label="$t('label.username')" :placeholder="$t('placeholder.username')"></InputWrap>
        <p class="text-sm font-normal leading-3 text-slate-600">
          {{ $t('info.publicProfileWillBe') }}<span class="text-black">Vida.pub/username</span>
        </p>
      </div>
      <TextareaWrap :label="$t('label.description')" :placeholder="$t('placeholder.description')"></TextareaWrap>
      <div class="flex flex-col space-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">{{ $t('info.socialLink') }}</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary" @click="openSocialLinkDialog">
            {{ $t('label.edit') }}
          </p>
        </div>
        <SocialLink
          v-for="link in testSocialLinks"
          :key="`social-link-${link.icon}`"
          :icon="link.icon"
          :url="link.url"
        ></SocialLink>
      </div>
      <div class="flex flex-col space-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">{{ $t('info.subscribeSetting') }}</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary">{{ $t('label.edit') }}</p>
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
import InputWrap from '@/components/form/InputWrap.vue'
import TextareaWrap from '@/components/form/TextareaWrap.vue'
import SocialLink from '@/components/form/SocialLink.vue'
import SubscribeSwitch from '@/components/form/SubscribeSwitch.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import { ref } from 'vue'
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'
import SelfIntro from '@comp/main/SelfIntro.vue'

const userInfo = ref({
  avatar: defaultAvatar,
  name: 'Angelababy',
  username: 'angelababy',
  subscriber: 1938,
  posts: 134,
  link: 'WenHsin.com',
  viewed: 2532,
  info: `🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get to
        the spread, daddy💦💦`,
})

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

const modalStore = useModalStore()
const { open } = modalStore

const openSocialLinkDialog = () => {
  open(MODAL_TYPE.SOCIAL_LINK, {
    size: 'lg',
    title: 'Social links Edit',
    showClose: true,
    confirmText: 'Save',
    confirmAction: () => {
      console.log('confirm')
    },
  })
}
</script>
