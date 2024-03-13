<template>
  <div>
    <SelfIntro :item="userData" show-bg-data show-personal-info show-all-info>
      <template #topButton>
        <div class="flex w-full items-center justify-between pl-100">
          <div class="flex items-center space-x-10">
            <SocialIcon name="instagram" :url="userData?.facebook_link" size="15"></SocialIcon>
            <SocialIcon name="facebook" :url="userData?.instagram_link" size="15"></SocialIcon>
            <SocialIcon name="twitter" :url="userData?.twitter_link" size="15"></SocialIcon>
            <SocialIcon name="youtube" :url="userData?.youtube_link" size="15"></SocialIcon>
            <SocialIcon name="tiktok" :url="userData?.tiktok_link" size="15"></SocialIcon>
          </div>
          <div class="flex items-center space-x-10">
            <div class="flex items-center justify-center" @click="copy(userData.share_url)">
              <Icon class="cursor-pointer" name="link" size="20"></Icon>
            </div>
            <router-link :to="{ name: 'mine-profile-set' }" class="flex items-center">
              <Icon class="cursor-pointer" name="setting" size="20"></Icon>
            </router-link>
          </div>
        </div>
      </template>
      <template #bottomButton>
        <div class="flex w-full space-x-10 sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
          <div class="w-9/12">
            <Button @click="openSubPlanDialog()">{{ $t('info.subscribeSetting') }}</Button>
          </div>
          <router-link :to="{ name: 'mine-profile-prvw' }" class="w-3/12">
            <Button contrast class="text-nowrap !px-0">{{ $t('info.prvw') }}</Button>
          </router-link>
        </div>
      </template>
    </SelfIntro>
    <div class="sticky top-0 z-10 flex h-36 w-full items-center bg-gray-f6 px-20 text-base font-bold">
      {{ $t('content.allPosts') }} {{ userData.post_num }}
    </div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-20" :item="item"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useFeedStore } from '@/store/feed'
import { useMineStore } from '@/store/mine'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import SocialIcon from '@comp/common/SocialIcon.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import { useInfinite } from '@use/request/infinite'
import { useCopyToClipboard } from '@use/utils/copyToClipboard'

const { copy } = useCopyToClipboard()

const { open: openSubPlanDialog } = useSubPlanStore()

const { userData } = storeToRefs(useAccountStore())

const feedStore = useFeedStore()
const { dataList, isLoading, noMore, next, init, reload } = useInfinite('Article.list', {
  params: { uuid: userData.value?.uuid, filter_by: 0, include_my_article: 1 },
  transformer: feedStore.sync,
})

const { setNextFn, clearNextFn } = useMineStore()

onMounted(async () => init())
onUnmounted(() => clearNextFn(next))
onActivated(() => {
  setNextFn(next)
  reload()
})
onDeactivated(() => clearNextFn(next))
</script>
