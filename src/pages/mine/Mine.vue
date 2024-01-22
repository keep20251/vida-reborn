<template>
  <Page>
    <template #main-top v-if="excludeRoutes.includes(route.name) === false">
      <div class="flex items-center justify-center border-b py-20">
        <div class="text-lg font-bold leading-5">
          {{ headerTitle.includes('.') ? $t(headerTitle) : headerTitle }}
        </div>
      </div>
    </template>
    <template #default>
      <ClientOnly>
        <router-view></router-view>
      </ClientOnly>
    </template>
    <template #aside-top>
      <ClientOnly>
        <div class="flex h-full items-center">
          <InputWrap
            class="grow"
            v-model="inputValue"
            :placeholder="'搜索...'"
            appendIcon="search2"
            @click:append="console.log('appendIcon')"
          ></InputWrap>
        </div>
      </ClientOnly>
    </template>
    <template #aside>
      <ClientOnly>
        <div class="m-15 grid space-y-20">
          <SetList />
          <div class="grid space-y-5">
            <Carousel :items="cats" :intervalTime="true"></Carousel>
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
import InputWrap from '@comp/form/InputWrap.vue'
import SetList from '@comp/mine/SetList.vue'
import Carousel from '@comp/common/Carousel.vue'
import { useHeadStore } from '@/store/head'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { MINE_TITLE } from '@/constant'
import { onActivated, onServerPrefetch, ref, onBeforeMount } from 'vue'
import ClientOnly from '@/components/common/ClientOnly'

const inputValue = ref('')

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
const { title, description, keywordArr, ogUrl } = storeToRefs(headStore)

onActivated(() => {
  loadHead()
})

function loadHead() {
  title.value = $t('meta.mine.title', { pipe: '|' })
  description.value = $t('meta.mine.description')
  keywordArr.value = [
    $t('meta.keywords.favorite'),
    $t('meta.keywords.intl'),
    $t('meta.keywords.subscribe'),
    $t('meta.keywords.interact'),
    $t('meta.keywords.title'),
  ]
  ogUrl.value = import.meta.env.VITE_APP_URL + route.path
}

const headerTitle = ref('title.mine')
const excludeRoutes = ['mine-home', 'mine-profile-set', 'mine-profile-prvw']

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
