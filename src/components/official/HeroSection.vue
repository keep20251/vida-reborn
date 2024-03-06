<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="hero-content-icon">
        <div class="hero-content-icon-img"></div>
      </div>
      <div class="hero-content-main-title">
        EMPOWERING CREATORS TO CONNECT with THEIR FANS
      </div>
      <div class="hero-content-sub-title">Monetising content made simple</div>
      <div class="hero-content-btns">
        <div class="btn">Login</div>
        <div class="btn">Registrer</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {

  @apply flex w-full relative h-[calc(100vh_-_3.75rem)];

  &-content {
    @apply w-full h-fit max-w-[1009px] mx-auto text-white relative flex gap-5 items-center top-[17%] flex-col;

    &-icon {
      @apply flex justify-end w-full;

      &-img {

        @apply w-100 h-100;
        background-image: url(@/assets/images/official/reverse-logo.svg);
        max-width: 100%;
        object-fit: cover;
      }
    }

    &-main-title {
      @apply text-center font-bold text-[67.29px] w-full;
      // max-width: 62em;

      // line-height: 34.9px;
      // align-items: center;
      // font-weight: 700;
      // font-size: 4.1em
    }

    &-sub-title {
      @apply text-[30px] font-bold;
    }

    &-btns {
      @apply justify-center flex gap-34 mt-36 text-[22px];

      div {
        @apply border rounded-full px-34 py-6
      }

      :first-child {
        background-color: white;
        @apply text-primary;
      }
    }
  }

  &-bg {
    @apply absolute w-full h-full bg-gray-600;
    background-image: url(@/assets/images/official/bg-hero.png);
    object-fit: cover;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f0f0f0;
    padding: 20px;
    text-align: center;
  }
}
</style>
