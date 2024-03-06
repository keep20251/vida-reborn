<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isActived = ref(false)

const toggleMenu = () => (isActived.value = !isActived.value)

const colseMenuOutside = (event) => {
  if (!event.target.closest('.official-lang-menu')) isActived.value = false
}

onMounted(() => {
  document.addEventListener('click', colseMenuOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', colseMenuOutside)
})
</script>

<template>
  <div class="official-lang-menu">
    <div class="official-lang-menu-btn" @click.prevent="toggleMenu">
      <div class="flex cursor-pointer items-center justify-center gap-5">
        <Icon name="officialEarth" size="25"></Icon>
        <div>中文</div>
        <Icon name="officialDropdown" class="officialDropdown pt-2" :class="{ rotate: isActived }" size="10"></Icon>
      </div>
    </div>
    <div
      :class="{ active: isActived }"
      class="official-lang-menu-items min-w-min rounded bg-white text-base text-gray-57 shadow-lg"
    >
      <!-- TODO:: add language items -->
      <!-- TODO: add language click event -->
      <div>English</div>
      <div>中文</div>
      <div>العربية</div>
      <div>日本語</div>
      <div>Français</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.official-lang-menu {
  text-wrap: nowrap;
  position: relative;
  &-btn {
    display: block;
    border: none;
    cursor: pointer;
  }
  &-items {
    display: none;
    position: absolute;
    top: 140%;
    right: 0;
    width: 100%;
    cursor: pointer;
  }
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
</style>
