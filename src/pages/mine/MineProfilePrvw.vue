<template>
  <div class="relative h-full w-full">
    <SelfIntro :item="userData" show-bg-data show-personal-Info show-all-info>
      <template #topButton>
        <div class="flex h-26 w-full items-center justify-between pl-100">
          <div class="flex items-center space-x-10">
            <SocialIcon name="instagram" :url="userData?.facebook_link" size="15"></SocialIcon>
            <SocialIcon name="facebook" :url="userData?.instagram_link" size="15"></SocialIcon>
            <SocialIcon name="twitter" :url="userData?.twitter_link" size="15"></SocialIcon>
            <SocialIcon name="youtube" :url="userData?.youtube_link" size="15"></SocialIcon>
            <SocialIcon name="tiktok" :url="userData?.tiktok_link" size="15"></SocialIcon>
          </div>
          <div class="flex items-center space-x-10">
            <Icon class="cursor-pointer" name="link" size="20"></Icon>
            <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
            <div v-if="isPrvwActive === 'isVisitor'">
              <Button class="!h-26 !px-20 !py-6">{{ $t('common.subscribe') }}</Button>
            </div>
          </div>
        </div>
      </template>
      <template #middleButton v-if="isPrvwActive === 'isVisitor'">
        <div class="cursor-pointer text-sm font-bold leading-3 underline underline-offset-2">
          {{ $t('common.viewSubscribePlan') }}
        </div>
      </template>
    </SelfIntro>
    <div class="mt-20 flex h-36 w-full items-center bg-gray-f6 px-20 text-base font-bold leading-md">
      {{ $t('content.allPosts') }} 85
    </div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id" divider>
        <template #default="{ item }">
          <Feed :item="item" class="py-20"></Feed>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading v-if="isLoading">{{ $t('common.loading') }}</Loading>
            <span v-if="noMore">{{ $t('common.noMore') }}</span>
          </div>
        </template>
      </List>
    </div>
    <div class="absolute left-0 top-0 h-full w-full"></div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useFeedStore } from '@/store/feed'
import { useHydrationStore } from '@/store/hydration'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import SocialIcon from '@comp/common/SocialIcon.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'

const mineStore = useMineStore()
const { isPrvwActive } = storeToRefs(mineStore)

const { userData } = storeToRefs(useAccountStore())

const feedStore = useFeedStore()
const { dataList, isLoading, noMore, init, next, revert } = useInfinite('Article.list', {
  params: { uuid: userData.value.uuid, filter_by: 0 },
  transformer: feedStore.sync,
})

const { mineCreatorArticles } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) mineCreatorArticles.value = dataList.value
})
onHydration(() => revert({ dataList: mineCreatorArticles.value }))

const { setNextFn, clearNextFn, activatePreview, deactivatePreview } = useMineStore()

onMounted(() => [setNextFn(next), activatePreview()])
onUnmounted(() => [clearNextFn(next), deactivatePreview()])
onActivated(() => [setNextFn(next), activatePreview()])
onDeactivated(() => [clearNextFn(next), deactivatePreview()])
</script>
