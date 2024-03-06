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
        <!-- <div>EMPOWERING</div> -->
        <!-- <div>CREATORS</div> -->
        <!-- <div>TO</div> -->
        <!-- <div>CONNECT</div> -->
        <!-- <div>with</div> -->
        <!-- <div>THEIR</div> -->
        <!-- <div>FANS</div> -->
        <div>EMPOWERING CREATORS</div>
        <div>TO CONNECT</div>
        <div>with</div>
        <div>THEIR FANS</div>
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
  @apply relative flex h-[calc(100vh_-_3.75rem)] w-full;

  &-content {
    @apply relative  top-[8%] mx-auto flex h-fit w-full max-w-5xl  flex-col items-center gap-5 break-words px-36 text-white sm:top-[17%];

    &-icon {
      @apply flex w-full justify-end;

      &-img {
        @apply h-100 w-100;
        background-image: url(@/assets/images/official/reverse-logo.svg);
        background-size: cover;
        max-width: 100%;
        object-fit: cover;
      }
    }

    &-main-title {
      @apply px-5 py-5 text-right text-[2.56em] font-bold sm:max-w-5xl sm:text-center sm:text-[3.5em];
      letter-spacing: 0.02em;
      word-spacing: 0.1em;
      line-height: 1.1;
      word-wrap: break-word;
      :nth-child(2) {
        @apply sm:inline sm:px-5 sm:text-[1em];
      }
      :nth-child(3) {
        @apply inline px-5 text-[.5em];
      }
      :nth-child(4) {
        @apply inline;
      }
    }

    &-sub-title {
      @apply text-[1.4em] font-bold;
      line-height: 2em;
    }

    &-btns {
      @apply mt-36 flex justify-center gap-34 text-[1.25em];

      div {
        @apply rounded-full border px-34 py-6;
      }

      :first-child {
        background-color: white;
        @apply text-primary;
      }
    }
  }

  &-bg {
    @apply absolute h-full w-full bg-gray-600;
    background-image: url(@/assets/images/official/bg-hero.png);
    object-fit: cover;
    background-size: cover;
    //   background-position: right 40% bottom 15%; //desktop
    background-position: right 40% bottom 10%; //desktop
    background-repeat: no-repeat;
    background-color: #f0f0f0;
    padding: 20px;
    text-align: center;
  }
}
</style>
