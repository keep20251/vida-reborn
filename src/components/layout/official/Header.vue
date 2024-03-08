<script setup>
import { useRoute, useRouter } from 'vue-router'
import HeaderBtn from '@/components/layout/official/HeaderBtn.vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'
import MobileMenuBtn from '@/components/layout/official/MobileMenuBtn.vue'

const { push } = useRouter()

const route = useRoute()
const headerButtons = [
  { text: 'Home', route: 'landing', href: '/' },
  { text: 'Vida Academy', route: 'academy', href: '/official/academy' },
  { text: 'Contact', route: 'contact', href: '/official/contact' },
]
</script>
<template>
  <header
    class="official-header sticky top-0 z-50 flex h-60 flex-row items-center justify-between gap-62 bg-primary px-19 text-white sm:px-50"
  >
    <div class="sm:flex-grow">
      <img src="@/assets/images/official/nav-logo.svg?url" class="min-w-[100px] max-w-full object-cover" alt="VIDA" />
    </div>

    <HeaderBtn
      v-for="(btn, index) in headerButtons"
      :key="`header-${index}-${btn.text}`"
      :text="btn.text"
      :bold="route.name === btn.route"
      :href="btn.href"
      @click="push({ name: btn.route })"
    />
    <div class="hidden sm:block">
      <LanguageSelectBtn />
    </div>
    <div class="sm:hidden">
      <MobileMenuBtn />
    </div>
  </header>
</template>
