<template>
  <Page>
    <template #main-top>
      <div class="flex h-full items-center">
        <InputWrap
          class="grow"
          v-model="inputValue"
          :placeholder="'搜索...'"
          :appendIcon="'search2'"
          @click:append="console.log('appendIcon')"
        ></InputWrap>
      </div>
    </template>
    <template #default>
      <div class="overflow-x-hidden">
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
    <template #aside>
      <ClientOnly>
        <div class="mt-20">
          <RelCreatorsCard></RelCreatorsCard>
          <BulletinCard class="mt-20"></BulletinCard>
          <Carousel class="mt-30" interval-time></Carousel>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import BulletinCard from '@comp/card/BulletinCard.vue'
import RelCreatorsCard from '@comp/card/RelCreatorsCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import ClientOnly from '@comp/common/ClientOnly'
import List from '@comp/common/List.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import Feed from '@comp/main/Feed.vue'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
const inputValue = ref('')
</script>
