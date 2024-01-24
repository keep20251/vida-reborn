<template>
  <div>
    <div v-if="isLogin">
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
            <router-link :to="{ name: 'mine-profile-set' }" class="flex items-center">
              <Icon class="cursor-pointer" name="setting" size="20"></Icon>
            </router-link>
            <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
          </div>
        </template>
        <template #bottomButton>
          <div class="ml-[20px] mr-[20px] flex w-full space-x-10 sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
            <div class="w-9/12">
              <Button>订阅设置</Button>
            </div>
            <router-link :to="{ name: 'mine-profile-prvw' }" class="w-3/12">
              <Button contrast class="text-nowrap">预览</Button>
            </router-link>
          </div>
        </template>
      </SelfIntro>
      <div class="leading-md flex h-36 w-full items-center bg-gray03 px-20 text-base font-bold">All Posts 85</div>
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
    <div v-else>
      <div class="flex items-center justify-center py-20">
        <div class="text-lg font-bold leading-5">註冊/登入</div>
      </div>
      <div class="leading-md mb-10 text-base font-normal">您还尚未登入，赶快加入我们吧！</div>
      <img
        class="rounded-md object-cover"
        src="https://i.postimg.cc/G2b2HYJ1/415980634-122147312060020771-8911205471669409308-n.jpg"
        alt=""
      />
      <div class="my-30 flex space-x-10">
        <Button @click="openAuthDialog(AUTH_ROUTES.SIGN_UP)" contrast>註冊</Button>
        <Button @click="openAuthDialog()">登入</Button>
      </div>
      <div class="leading-lg text-center text-base font-normal text-gray66">
        <p>趕快加入VIDA吧！更多奇幻的特色內容正在等著你！</p>
        <p>
          所有使用過程中須遵守<a href="#"><b>使用者條款</b></a>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Button from '@comp/common/Button.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'
import { useAccountStore } from '@/store/account'
import { storeToRefs } from 'pinia'
import { useAuthRouteStore } from '@/store/auth-route'
import { AUTH_ROUTES } from '@/constant'

const accountStore = useAccountStore()
const { isLogin } = storeToRefs(accountStore)

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

const { open: openAuthDialog } = useAuthRouteStore()
</script>
