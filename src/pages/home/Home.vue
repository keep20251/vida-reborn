<template>
  <Page infinite @load="onLoad">
    <template #default>
      <div class="overflow-x-hidden px-20">
        <List :items="items" item-key="id">
          <template #default="{ last }">
            <Feed class="py-20"></Feed>
            <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
          </template>
          <template #bottom>
            <div class="flex items-center justify-center py-8 text-gray36">
              <Loading></Loading>{{ $t('common.noMore') }}
            </div>
          </template>
        </List>
      </div>
    </template>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #aside>
      <div>
        <BulletinCard class="mt-20"></BulletinCard>
        <RecCard class="mt-30" :items="recCreators"></RecCard>
        <Carousel class="mt-30" :items="cats" :intervalTime="true"></Carousel>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>home aside</div>
        <div>最後一行home aside</div>
      </div>
    </template>
    <template #aside-top>
      <div class="flex h-full items-center">
        <InputWrap
          class="grow"
          v-model="searchValue"
          :placeholder="'搜索...'"
          :appendIcon="'search'"
          @click:append="console.log('appendIcon')"
        ></InputWrap>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { onActivated, onServerPrefetch, ref } from 'vue'
import Tab from '@comp/navigation/Tab.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Loading from '@comp/common/Loading.vue'
import { useHeadStore } from '@/store/head'
import InputWrap from '@comp/form/InputWrap.vue'
import RecCard from '@comp/card/RecCard.vue'
import BulletinCard from '@comp/card/BulletinCard.vue'
import Carousel from '@comp/common/Carousel.vue'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const tab = ref(1)
const tabOptions = ref([
  { label: 'common.recommand', value: 1 },
  { label: 'common.following', value: 2 },
  { label: 'common.popular', value: 3 },
])

const searchValue = ref('')

const recCreators = ref([
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938 },
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938 },
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938 },
])

const cats = ref([
  { img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
  { img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg' },
  { img: 'https://images.pexels.com/photos/3054570/pexels-photo-3054570.jpeg' },
  { img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg' },
  { img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg' },
])

function onLoad() {
  console.log('load at', new Date())
}

const { reset: resetHeadStore } = useHeadStore()

onServerPrefetch(() => {
  resetHeadStore()
})

onActivated(() => {
  resetHeadStore()
})
</script>
