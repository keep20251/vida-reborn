<script setup>
import { ref } from 'vue'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'

const isActived = ref(false)
const toggleMenu = () => {
  console.log('click')
  isActived.value = !isActived.value
}
</script>

<template>
  <div class="official-mobile-menu">
    <div class="official-mobile-menu-btn" @click="toggleMenu">
      <Icon name="officialMenu" size="25"></Icon>
    </div>
    <div class="official-mobile-menu-items" :class="{ active: isActived }">
      <div>Home</div>
      <div>Vida Academy</div>
      <div>Contact</div>
      <LanguageSelectBtn />
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
    @apply px-15 py-10 leading-10;
    min-width: 150px;
    word-wrap: nowrap;
  }
  .official-mobile-menu-items.active {
    @apply absolute  -right-15 top-41 block bg-primary;
  }
}
</style>
