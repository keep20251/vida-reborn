<template>
  <div>
    <SelfIntro :item="userInfo" show-all-info>
      <template #topButton>
        <div class="flex items-center space-x-10">
          <Icon class="cursor-pointer" name="link" size="20"></Icon>
          <router-link :to="{ name: 'mine-profile-set' }" class="flex items-center">
            <Icon class="cursor-pointer" name="setting" size="20"></Icon>
          </router-link>
          <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
        </div>
      </template>
    </SelfIntro>

    <Tab v-model="tab" :options="tabOptions" class="mt-20 !h-35"></Tab>
    <div v-if="tab === 1">
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
    <div v-if="tab === 2">
      <div>123</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'
import Tab from '@comp/navigation/Tab.vue'
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

const tab = ref(1)
const tabOptions = ref([
  { label: 'common.recommand', value: 1 },
  { label: 'common.subscribe', value: 2 },
])

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
</script>
