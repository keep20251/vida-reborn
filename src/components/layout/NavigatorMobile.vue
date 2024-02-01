<template>
  <nav class="fixed bottom-0 flex h-60 w-full bg-white shadow-[0px_-2px_9px_0px_rgba(0,0,0,0.1)]">
    <router-link class="grow" :to="`/${locale}`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atHome" name="home" size="20"></Icon>
        <Icon v-else name="homeOutline" size="20"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/search`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atSearch" name="search" size="20"></Icon>
        <Icon v-else name="searchOutline" size="20"></Icon>
      </div>
    </router-link>
    <Link class="grow" :href="`/${locale}/publish`" @click="onPublishClick">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon name="publish" size="16"></Icon>
      </div>
    </Link>
    <router-link class="grow" :to="`/${locale}/message`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMessage" name="message" size="20"></Icon>
        <Icon v-else name="messageOutline" size="20"></Icon>
      </div>
    </router-link>
    <router-link class="grow" :to="`/${locale}/mine`">
      <div class="flex items-center justify-center space-x-16 px-12 py-16">
        <Icon v-if="atMine" name="mine" size="20"></Icon>
        <Icon v-else name="mineOutline" size="20"></Icon>
      </div>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import { usePublishStore } from '@/store/publish'
import Link from '@comp/common/Link.vue'
import { useRouters } from '@use/routers'
import { useLocale } from '@use/utils/locale'

const route = useRoute()
const atHome = computed(() => route.name === 'home')
const atSearch = computed(() => route.name === 'search')
const atMessage = computed(() => route.name === 'message')
const atMine = computed(() => route.name.includes('mine'))

const locale = useLocale()

const { to } = useRouters()

const { fileSelectDialog } = storeToRefs(useDialogStore())

const publishStore = usePublishStore()
const { isEditing } = storeToRefs(publishStore)
function onPublishClick() {
  if (isEditing.value) {
    to('publish')
  } else {
    fileSelectDialog.value = true
  }
}
</script>
