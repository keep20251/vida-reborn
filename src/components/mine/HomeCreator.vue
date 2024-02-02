<template>
  <div>
    <SelfIntro :item="userData" show-bg-data show-personal-info show-all-info>
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
            <Button contrast class="text-nowrap !px-0">{{ $t('info.prvw') }}</Button>
          </router-link>
        </div>
      </template>
    </SelfIntro>
    <div class="flex h-36 w-full items-center bg-gray-f6 px-20 text-base font-bold leading-md">
      {{ $t('content.allPosts') }} {{ userData.post_num }}
    </div>
    <div class="overflow-x-hidden">
      <List :items="dataList" item-key="id">
        <template #default="{ item, last }">
          <Feed class="py-20" :item="item"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
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
import { computed, onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useHydrationStore } from '@/store/hydration'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useInfinite } from '@use/request/infinite'

const { t: $t } = useI18n()
const { userData } = storeToRefs(useAccountStore())

console.log('是2就是創作者', userData.value?.auth_status)
const isPermission = computed(() => {
  if (userData.value?.auth_status === 2) {
    return true
  } else {
    return false
  }
})

const { dataList, isLoading, noMore, init, next, reload, revert } = useInfinite('Article.list', {
  params: {},
})

const { mineCreatorArticles } = storeToRefs(useHydrationStore())
onServerClientOnce(async (isSSR) => {
  await init()
  if (isSSR) mineCreatorArticles.value = dataList.value
})
onHydration(() => revert(mineCreatorArticles.value))

const { setNextFn, clearNextFn } = useMineStore()

onMounted(() => setNextFn(next))
onUnmounted(() => clearNextFn(next))
onActivated(() => setNextFn(next))
onDeactivated(() => clearNextFn(next))
</script>
