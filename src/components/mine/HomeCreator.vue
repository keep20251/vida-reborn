<template>
  <div>
    <SelfIntro :item="userInfo" show-bg-data show-personal-info show-all-info>
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
            <Button>{{ $t('info.subscribeSetting') }}</Button>
          </div>
          <router-link :to="{ name: 'mine-profile-prvw' }" class="w-3/12">
            <Button contrast class="!px-0 text-nowrap">{{ $t('info.prvw') }}</Button>
          </router-link>
        </div>
      </template>
    </SelfIntro>
    <div class="bg-gray-f6 flex h-36 w-full items-center px-20 text-base font-bold leading-md">
      {{ $t('content.allPosts') }} 85
    </div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="text-gray-a3 flex items-center justify-center py-8">
            <Loading></Loading> {{ $t('common.loading') }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())

const userInfo = computed(() => ({
  avatar: defaultAvatar,
  name: userData.value?.nickname,
  username: userData.value?.username,
  subscriber: userData.value?.subscriber_count,
  posts: userData.value?.post_num,
  link: 'WenHsin.com',
  viewed: userData.value?.view_count,
  info: userData.value?.description,
}))

console.log('是2就是創作者', userData.value?.auth_status)
const isPermission = computed(() => {
  if (userData.value?.auth_status === 2) {
    return true
  } else {
    return false
  }
})

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
