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
      <InputWrap
        v-model="profile.nickname"
        :label="$t('label.displayName')"
        :placeholder="$t('placeholder.displayName')"
      ></InputWrap>
      <div class="flex flex-col space-y-11">
        <InputWrap
          v-model="profile.username"
          :label="$t('label.username')"
          :placeholder="$t('placeholder.username')"
        ></InputWrap>
        <p class="text-sm font-normal leading-3 text-slate-600">
          {{ $t('info.publicProfileWillBe') }}<span class="text-black">Vida.pub/{{ userData.username }}</span>
        </p>
      </div>
      <TextareaWrap
        v-model="profile.description"
        :label="$t('label.description')"
        :placeholder="$t('placeholder.description')"
      ></TextareaWrap>
      <div class="flex flex-col space-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">{{ $t('info.socialLink') }}</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary" @click="openSocialLinkDialog">
            {{ $t('label.edit') }}
          </p>
        </div>
        <SocialLink
          v-if="profile.socialLinks.instagram.value"
          icon="socialInstagram"
          :url="profile.socialLinks.instagram.value"
        ></SocialLink>
        <SocialLink
          v-if="profile.socialLinks.facebook.value"
          icon="socialFacebook"
          :url="profile.socialLinks.facebook.value"
        ></SocialLink>
        <SocialLink
          v-if="profile.socialLinks.youtube.value"
          icon="socialYoutube"
          :url="profile.socialLinks.youtube.value"
        ></SocialLink>
        <SocialLink
          v-if="profile.socialLinks.twitter.value"
          icon="socialTwitter"
          :url="profile.socialLinks.twitter.value"
        ></SocialLink>
        <SocialLink
          v-if="profile.socialLinks.tiktok.value"
          icon="socialTiktok"
          :url="profile.socialLinks.tiktok.value"
        ></SocialLink>
      </div>
      <div class="flex flex-col space-y-10">
        <div class="flex items-center justify-between pr-4">
          <p class="text-base font-normal leading-3">{{ $t('info.subscribeSetting') }}</p>
          <p class="cursor-pointer text-base font-normal leading-3 text-primary">{{ $t('label.edit') }}</p>
        </div>
        <div v-if="subscriptions.length > 0" class="flex flex-col space-y-10">
          <SubscribeSwitch
            v-for="(sub, index) in subscriptions"
            :key="`sub-${index}`"
            v-model="sub.isOpen"
            :title="sub.title"
            :price="sub.price"
          ></SubscribeSwitch>
        </div>
      </div>
      <div class="flex flex-col space-y-10">
        <Button @click="onSave">{{ $t('common.save') }}</Button>
        <div class="text-base text-warning" v-if="serverError">{{ serverError }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import InputWrap from '@/components/form/InputWrap.vue'
import TextareaWrap from '@/components/form/TextareaWrap.vue'
import SocialLink from '@/components/form/SocialLink.vue'
import SubscribeSwitch from '@/components/form/SubscribeSwitch.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import useRequest from '@use/request/index.js'
import Button from '@comp/common/Button.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'
import { useAccountStore } from '@/store/account'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@use/utils/locale'
import { useRouter } from 'vue-router'

const serverError = ref('')
const { t: $t } = useI18n()

const { userData } = storeToRefs(useAccountStore())
console.log(`userData`, userData.value)

const userInfo = computed(() => ({
  avatar: defaultAvatar,
  name: userData.value.nickname,
  username: userData.value.username,
  subscriber: userData.value.subscriber_count,
  posts: userData.value.post_num,
  link: 'WenHsin.com',
  viewed: userData.value.view_count,
  info: userData.value.descriptions,
}))

const profile = reactive({
  nickname: userData.value.nickname,
  username: userData.value.username,
  description: userData.value.description,
  socialLinks: {
    instagram: {
      value: userData.value.instagram_link,
    },
    facebook: {
      value: userData.value.facebook_link,
    },
    youtube: {
      value: userData.value.youtube_link,
    },
    twitter: {
      value: userData.value.twitter_link,
    },
    tiktok: {
      value: userData.value?.tiktok_link ?? null,
    },
  },
})

// TODO 訂閱設定還沒串好
// TODO 上傳大頭貼跟背景圖還沒串好
// const subscriptions = ref([
//   { title: 'General', price: 0.99, isOpen: true },
//   { title: 'Silver', price: 9.99, isOpen: true },
//   { title: 'Golden', price: 99.99, isOpen: true },
// ])

const subscriptions = ref([])

async function fetchSubscriptions() {
  const { data, execute } = useRequest('Subscription.list')
  try {
    await execute()
    subscriptions.value = data.value?.list
  } catch (e) {
    console.error(e)
    serverError.value = e.message ?? 'Server Error'
  }
}

onMounted(async () => {
  await fetchSubscriptions()
})

const modalStore = useModalStore()
const { open } = modalStore

const openSocialLinkDialog = () => {
  open(MODAL_TYPE.SOCIAL_LINK, {
    size: 'lg',
    title: $t('title.editSocialLink'),
    showClose: true,
    confirmText: $t('common.save'),
    confirmAction: (data) => (profile.socialLinks = data),
    content: profile.socialLinks,
  })
}

const locale = useLocale()
const { push } = useRouter()

const onSave = async () => {
  const { execute } = useRequest('User.modifyInfo')

  const payload = {
    nickname: profile.nickname,
    username: profile.username,
    description: profile.description,
    lang: locale.value,
  }
  const socialMedia = {}
  Object.keys(profile.socialLinks).forEach((key) => {
    socialMedia[key] = profile.socialLinks[key].value || null
  })
  payload.set_social_media = JSON.stringify(socialMedia)

  try {
    await execute(payload)
    Object.entries(profile).forEach(([key, value]) => {
      if (key === 'socialLinks') {
        Object.entries(value).forEach(([k, v]) => (userData.value[`${k}_link`] = v.value))
      }
      userData.value[key] = value
    })
    push({ name: 'mine-home' })
  } catch (e) {
    console.error(e)
    serverError.value = e.message ?? 'Server Error'
  }
}
</script>
