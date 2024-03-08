<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '@use/utils/locale'
import { locales } from '@/i18n'

const _locale = useLocale()
const currentLocaleLabel = computed(() => locales.find((item) => item.value === _locale.value).key)

const isActived = ref(false)

const toggleMenu = () => (isActived.value = !isActived.value)

const closeMenuOutside = (event) => {
  if (!event.target.closest('.official-lang-menu')) isActived.value = false
}

onMounted(() => {
  document.addEventListener('click', closeMenuOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenuOutside)
})
</script>

<template>
  <div class="official-lang-menu text-nowrap relative">
    <div class="official-lang-menu-btn" @click.prevent="toggleMenu">
      <div class="flex cursor-pointer items-center justify-center gap-5">
        <Icon name="officialEarth" size="25"></Icon>
        <div>{{ $t(currentLocaleLabel) }}</div>
        <Icon name="officialDropdown" class="officialDropdown pt-2" :class="{ rotate: isActived }" size="10"></Icon>
      </div>
    </div>
    <div
      :class="{ active: isActived }"
      class="official-lang-menu-items scrollbar absolute right-1 top-[140%] hidden max-h-[138px] w-full min-w-min cursor-pointer overflow-y-scroll rounded bg-white text-base text-gray-57 shadow-lg"
    >
      <div v-for="locale in locales" :key="`lang-${locale.value}`" @click="() => (_locale = locale.value)">
        {{ $t(locale.key) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* TODO: 把這邊換成tailwind css*/

.official-lang-menu {
  text-wrap: nowrap;
  &-items.active {
    display: block;
    animation: slideDown 0.3s ease forwards;
  }
  &-items div {
    padding: 10px 20px;
    &:hover {
      background-color: #6567e8;
      color: white;
    }
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

.rotate {
  animation: rotate180 0.3s forwards;
}

@keyframes rotate180 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
</style>
