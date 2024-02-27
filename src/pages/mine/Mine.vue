<template>
  <Page infinite @load="nextFn">
    <template #app-top v-if="!excludeRoutes.includes(route.name) && headerTitle">
      <Head :title="headerTitle.includes('.') ? $t(headerTitle) : headerTitle"></Head>
    </template>
    <template #default>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </template>
    <template #aside-top>
      <TopSearchBar to-search></TopSearchBar>
    </template>
    <template #aside>
      <ClientOnly>
        <div v-show="isPreviewMode" class="m-15 grid space-y-20">
          <SubscribeCard v-for="n in 3" :key="`subscribe-card-${n}`"></SubscribeCard>
        </div>
        <div v-show="!isPreviewMode" class="grid space-y-20">
          <SetList />
          <div class="grid space-y-5">
            <Carousel :items="cats" interval-time></Carousel>
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
import { useHeadStore } from '@/store/head'
import { useMineStore } from '@/store/mine'
import SubscribeCard from '@comp/card/SubscribeCard.vue'
import Carousel from '@comp/common/Carousel.vue'
import SetList from '@comp/mine/SetList.vue'
import Head from '@comp/navigation/Head.vue'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'
import { MINE_TITLE } from '@const'

const { nextFn, isPreviewMode } = storeToRefs(useMineStore())

const cats = ref([
  { img: 'https://i.postimg.cc/3RTHR6kh/4edca499dd436a67fa25e5fbf3cb5582.png' },
  { img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
  { img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg' },
  { img: 'https://images.pexels.com/photos/3054570/pexels-photo-3054570.jpeg' },
  { img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg' },
  { img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg' },
])

const route = useRoute()
const { t: $t } = useI18n()
const headStore = useHeadStore()
const { setup: setupHead, reset: resetHead } = headStore

onActivated(() => loadHead())
onDeactivated(() => resetHead())

function loadHead() {
  setupHead({
    title: $t('meta.mine.title', { pipe: '|' }),
    description: $t('meta.mine.description'),
    keywords: [
      $t('meta.keywords.favorite'),
      $t('meta.keywords.intl'),
      $t('meta.keywords.subscribe'),
      $t('meta.keywords.interact'),
      $t('meta.keywords.title'),
    ],
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
