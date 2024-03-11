<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import LanguageSelectBtn from '@/components/layout/official/LanguageSelectBtn.vue'

const { push } = useRouter()

const isActived = ref(false)
const toggleMenu = () => (isActived.value = !isActived.value)

const menuBtns = [
  { label: 'Home', href: '/', route: 'landing', hash: '', translate: 'official.header.home' },
  {
    label: 'Vida Academy',
    href: '/official/academy',
    route: 'academy',
    hash: '',
    translate: 'official.header.academy',
  },
  { label: 'Contact', href: '#contact', route: 'landing', hash: '#contact', translate: 'official.header.contact' },
  { label: 'Language', href: '#', route: '', hash: '', translate: '', component: LanguageSelectBtn },
]

const closeMenuOutside = (event) => {
  if (!event.target.closest('.official-mobile-menu')) isActived.value = false
}

const closeMenu = () => (isActived.value = false)

onMounted(() => document.addEventListener('click', closeMenuOutside))

onBeforeUnmount(() => document.removeEventListener('click', closeMenuOutside))
</script>

<template>
  <div class="official-mobile-menu">
    <div class="official-mobile-menu-btn" @click="toggleMenu">
      <Icon name="officialMenu" size="25"></Icon>
    </div>
    <div class="official-mobile-menu-items" :class="{ active: isActived }">
      <div v-for="btn in menuBtns" :key="`menu-${btn.label}`">
        <template v-if="btn.component">
          <component :is="btn.component" @closeMenu="closeMenu" />
        </template>
        <template v-else>
          <a :href="btn.href">
            {{ $t(btn.translate) }}
          </a>
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
    @apply absolute -right-15 top-41 block bg-primary;
    animation: slideDown 0.3s ease forwards;
  }
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
