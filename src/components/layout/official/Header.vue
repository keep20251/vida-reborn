<script setup>
import HeaderBtn from '@/components/layout/official/HeaderBtn.vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'
import MobileMenuBtn from '@/components/layout/official/MobileMenuBtn.vue'
</script>
<template>
  <header
    class="official-header sticky top-0 flex h-60 flex-row items-center justify-between gap-62 bg-primary px-19 text-white sm:px-50"
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

<style lang="scss" scoped>
.official-header {
  .web-logo {
    max-width: 100%;
    object-fit: cover;
    min-width: 100px;
  }
}
</style>
