<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import HeaderBtn from '@/components/layout/official/HeaderBtn.vue'

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)
</script>
<template>
  <header
    class="official-header flex h-52 flex-row items-center justify-between gap-62 bg-primary px-20 text-white sm:px-50"
  >
    <div class="sm:flex-grow">icon</div>

    <HeaderBtn class="hidden sm:block" text="Home" />
    <HeaderBtn class="hidden sm:block" text="Visa Academy" />
    <HeaderBtn class="hidden sm:block" text="Contact" />
    <div class="hidden sm:block">lang</div>
    <div class="sm:hidden">mobile menu</div>
  </header>
</template>

<style scoped></style>
