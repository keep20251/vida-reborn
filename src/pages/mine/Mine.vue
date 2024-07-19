<template>
  <Page infinite @load="nextFn" :pull-to-reload="reloadFn !== null" @reload="reloadFn">
    <template #app-top v-if="!excludeRoutes.includes(route.name) && headerTitle">
      <ClientOnly>
        <Head :title="headerTitle.includes('.') ? $t(headerTitle) : headerTitle"></Head>
      </ClientOnly>
    </template>
    <template #main-top v-if="tab">
      <ClientOnly>
        <Tab v-model="tab" :options="tabOptions"></Tab>
      </ClientOnly>
    </template>
    <template #default>
      <ClientOnly>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </ClientOnly>
    </template>
    <template #aside-top>
      <TopSearchBar to-search></TopSearchBar>
    </template>
    <template #aside>
      <ClientOnly>
        <div v-show="isPreviewMode" class="m-15 grid space-y-20">
          <SubscribeCard
            v-for="(item, index) in userData?.subscription_list"
            :key="`subscribe-card-${index}`"
            :item="item"
          ></SubscribeCard>
        </div>
        <div v-show="!isPreviewMode" class="grid space-y-20">
          <SetList />
          <div class="grid space-y-5">
            <Carousel interval-time :label="$t('label.eventAd')"></Carousel>
            <p class="text-xs font-normal leading-3 text-gray-400">
              Terms of Service Privacy Policy Cookie Policy Ad info About @ 2023 VIDA corp
            </p>
          </div>
        </div>
      </ClientOnly>
    </template>
  </Page>
</template>

<script setup>
import { onActivated, onBeforeMount, onDeactivated, onServerPrefetch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useHeadStore } from '@/store/head'
import { useMineStore } from '@/store/mine'
import SubscribeCard from '@comp/card/SubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import SetList from '@comp/mine/SetList.vue'
import Head from '@comp/navigation/Head.vue'
import Tab from '@comp/navigation/Tab.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { MINE_TITLE } from '@const/index.js'

const { tab, tabOptions, nextFn, reloadFn, isPreviewMode } = storeToRefs(useMineStore())
const { userData } = storeToRefs(useAccountStore())

const route = useRoute()
const { t: $t } = useI18n()
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore

onActivated(loadHead)
onDeactivated(resetHead)

function loadHead() {
  setupHead({
    title: { key: 'meta.mine.title' },
    description: { key: 'meta.mine.description' },
    keywords: {
      items: [
        'meta.keywords.favorite',
        'meta.keywords.intl',
        'meta.keywords.subscribe',
        'meta.keywords.interact',
        'meta.keywords.title',
      ],
      needTranslate: true,
    },
    // url: `/${route.path}`,
  })
}

const headerTitle = ref('title.mine')
const excludeRoutes = ['mine-profile-prvw']

function updateTitle(routeName) {
  headerTitle.value = MINE_TITLE[routeName]
}

onBeforeMount(() => updateTitle(route.name))
onBeforeRouteUpdate((to) => updateTitle(to.name))

onServerPrefetch(() => {
  loadHead()
  updateTitle(route.name)
})
</script>
