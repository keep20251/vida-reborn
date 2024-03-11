<script setup>
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import About from '@comp/official/About.vue'
import Academy from '@comp/official/Academy.vue'
import Advantages from '@comp/official/Advantages.vue'
import AttractGlobalAudience from '@comp/official/AttractGlobalAudience.vue'
import HeroSection from '@comp/official/HeroSection.vue'
import JoinUs from '@comp/official/JoinUs.vue'
import { useRouters } from '@use/routers'

const accountStore = useAccountStore()
const { token } = storeToRefs(accountStore)
if (token.value) {
  useRouters().replace('home')
}
</script>
<template>
  <HeroSection />
  <About />
  <JoinUs />
  <AttractGlobalAudience />
  <Advantages />
  <Academy />
</template>
