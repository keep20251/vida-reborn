<template>
  <nav
    class="fixed bottom-0 z-50 flex h-60 w-full items-center bg-white shadow-bottom transition-transform"
    :class="{ 'translate-y-full': !isShow }"
  >
    <router-link class="grow" :to="`/${locale}`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atHome" name="home" size="30"></Icon>
        <Icon v-else name="homeOutline" size="30"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/search`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atSearch" name="search" size="30"></Icon>
        <Icon v-else name="searchOutline" size="30"></Icon>
      </div>
    </router-link>
    <Link class="grow" href="/publish" @click="onPublishClick">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon name="publish" size="16"></Icon>
      </div>
    </Link>
    <Link class="grow" href="/message" @click="toMessage">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMessage" name="message" size="30"></Icon>
        <Icon v-else name="messageOutline" size="30"></Icon>
      </div>
    </Link>
    <router-link class="grow" :to="`/${locale}/mine`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMine" name="mine" size="30"></Icon>
        <Icon v-else name="mineOutline" size="30"></Icon>
      </div>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { useNavStore } from '@/store/nav'
import { usePublishStore } from '@/store/publish'
import Link from '@comp/common/Link.vue'
import { useRouters } from '@use/routers'
import { useLocale } from '@use/utils/locale'

const route = useRoute()
const atHome = computed(() => route.name === 'home')
const atSearch = computed(() => route.name === 'search')
const atMessage = computed(() => route.name === 'message')
const atMine = computed(() => route.name.includes('mine'))

const navStore = useNavStore()
const { isShow } = storeToRefs(navStore)

const locale = useLocale()

const { to } = useRouters()

const { afterLoginAction } = useAccountStore()
const { fileSelectDialog } = storeToRefs(useDialogStore())

const toMessage = afterLoginAction(() => to('message'))

const publishStore = usePublishStore()
const { isEditing } = storeToRefs(publishStore)
const onPublishClick = afterLoginAction(() => {
  if (isEditing.value) {
    to('publish')
  } else {
    fileSelectDialog.value = true
  }
})
</script>
