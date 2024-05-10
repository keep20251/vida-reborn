<template>
  <nav
    class="fixed bottom-0 z-20 flex h-60 w-full items-center bg-white shadow-bottom transition-transform"
    :class="{ 'translate-y-full': !isShow }"
  >
    <router-link class="grow" to="/home">
      <div class="flex items-center justify-center space-x-16 px-12 py-16" @click="checkHomeAgain">
        <Icon v-if="atHome" name="home" size="30"></Icon>
        <Icon v-else name="homeOutline" size="30"></Icon>
      </div>
    </router-link>
    <router-link class="grow" to="/search">
      <div class="flex items-center justify-center space-x-16 px-12 py-16" @click="checkSearchAgain">
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
      <div class="flex items-center justify-center space-x-16 px-12 py-16" @click="checkMessageAgain">
        <Icon v-if="atMessage" name="message" size="30"></Icon>
        <Icon v-else name="messageOutline" size="30"></Icon>
      </div>
    </Link>
    <router-link class="grow" to="/mine">
      <div class="flex items-center justify-center space-x-16 px-12 py-16" @click="checkMineAgain">
        <Icon v-if="atMine" name="mine" size="30"></Icon>
        <Icon v-else name="mineOutline" size="30"></Icon>
      </div>
    </router-link>
  </nav>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useNavStore } from '@/store/nav'
import Link from '@comp/common/Link.vue'
import { useNavigator } from '@use/navigator'

const {
  atHome,
  atSearch,
  atMessage,
  atMine,
  toMessage,
  onPublishClick,
  checkHomeAgain,
  checkSearchAgain,
  checkMessageAgain,
  checkMineAgain,
} = useNavigator()

const navStore = useNavStore()
const { isShow } = storeToRefs(navStore)
</script>
