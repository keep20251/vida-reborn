<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useRouters } from '@use/routers'
import HeaderBtn from '@/components/layout/official/HeaderBtn.vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'
import MobileMenuBtn from '@/components/layout/official/MobileMenuBtn.vue'

const { to } = useRouters()

const { push } = useRouter()

const route = useRoute()
const headerButtons = [
  { text: 'official.header.home', route: 'landing', href: '/' },
  { text: 'official.header.academy', route: 'academy', href: '/official/academy' },
]
</script>
<template>
  <header
    class="official-header sticky top-0 z-30 flex h-60 flex-row items-center justify-between gap-62 bg-primary px-15 text-white sm:px-50"
  >
    <div class="sm:flex-grow">
      <img
        src="@/assets/images/official/nav-logo.svg?url"
        class="min-w-[100px] max-w-full cursor-pointer object-cover"
        alt="VIDA"
        @click="to('home')"
      />
    </div>

    <HeaderBtn
      v-for="(btn, index) in headerButtons"
      class="hidden sm:block"
      :key="`header-${index}-${btn.text}`"
      :text="btn.text"
      :bold="route.name === btn.route"
      :href="btn.href"
      @click="push({ name: btn.route })"
    />
    <a class="hidden sm:block" href="#contact">{{ $t('official.header.contact') }}</a>
    <div class="hidden sm:block">
      <LanguageSelectBtn />
    </div>
    <div class="sm:hidden">
      <MobileMenuBtn />
    </div>
  </header>
</template>
