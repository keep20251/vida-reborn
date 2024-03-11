<script setup>
import { ref } from 'vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'

const isActived = ref(false)
const toggleMenu = () => {
  console.log('click')
  isActived.value = !isActived.value
}
const menuBtns = [
  { label: 'Home', href: '/', route: 'landing', translate: 'official.header.home' },
  { label: 'Vida Academy', href: '/official/academy', route: 'academy', translate: 'official.header.academy' },
  { label: 'Contact', href: '#contact', route: 'contact', translate: 'official.header.contact' },
  { label: 'Language', href: '#', route: '', translate: '', component: LanguageSelectBtn },
]
</script>

<template>
  <div class="official-mobile-menu">
    <div class="official-mobile-menu-btn" @click="toggleMenu">
      <Icon name="officialMenu" size="25"></Icon>
    </div>
    <div class="official-mobile-menu-items" :class="{ active: isActived }">
      <div v-for="btn in menuBtns" :key="`menu-${btn.label}`">
        <template v-if="btn.component">
          <component :is="btn.component" />
        </template>
        <template v-else>
          <a :href="btn.href">{{ $t(btn.translate) }}</a>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.official-mobile-menu {
  @apply relative;
  .official-mobile-menu-btn {
    @apply flex items-center justify-center p-2;
  }
  .official-mobile-menu-items {
    @apply hidden;
    @apply px-15 py-10;
    min-width: 150px;
    word-wrap: nowrap;
    line-height: 3rem;
  }
  .official-mobile-menu-items.active {
    @apply absolute  -right-15 top-41 block bg-primary;
  }
}
</style>
