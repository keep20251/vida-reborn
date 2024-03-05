<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import HeaderBtn from '@/components/layout/official/HeaderBtn.vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'
import MobileMenuBtn from '@/components/layout/official/MobileMenuBtn.vue'

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)
</script>
<template>
  <header
    class="official-header flex h-60 flex-row items-center justify-between gap-62 bg-primary px-19 text-white sm:px-50"
  >
    <div class="sm:flex-grow">
      <img src="@/assets/images/official/nav-logo.svg?url" class="web-logo" alt="VIDA" />
    </div>

    <HeaderBtn class="hidden sm:block" text="Home" />
    <HeaderBtn class="hidden sm:block" text="Visa Academy" />
    <HeaderBtn class="hidden sm:block" text="Contact" />
    <div class="hidden sm:block">
      <LanguageSelectBtn />
    </div>
    <div class="sm:hidden">
      <MobileMenuBtn />
    </div>
  </header>
</template>

<style scoped>
.official-header {
  .web-logo {
    max-width: 100%;
    object-fit: cover;
    min-width: 100px;
  }

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
