<template>
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="hero-content-icon">
        <div class="hero-content-icon-img"></div>
      </div>
      <div class="hero-content-main-title">
        <div>{{ $t('official.hero.1') }}</div>
        <div>{{ $t('official.hero.2') }}</div>
        <div>{{ $t('official.hero.3') }}</div>
        <div>{{ $t('official.hero.4') }}</div>
      </div>
      <div class="hero-content-sub-title">{{ $t('official.hero.5') }}</div>
      <div class="hero-content-btns">
        <a href="/mine">{{ $t('label.login') }}</a>
        <a href="/mine">{{ $t('label.register') }}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  @apply relative flex h-[calc(100vh_-_3.75rem)] w-full;

  &-content {
    @apply relative  top-[8%] mx-auto flex h-fit w-full max-w-5xl  flex-col items-center space-x-10 space-y-10 break-words px-36 text-white sm:top-[17%];

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
      @apply font-bold sm:text-[2em];
    }

    &-btns {
      @apply mt-5 flex justify-center space-x-34 pt-30 text-[1.25em];

      a {
        cursor: pointer;
        @apply rounded-full border px-34 py-6;
      }

      :hover {
        @apply bg-white text-primary;
      }
    }
  }

  &-bg {
    @apply absolute -top-60 h-full w-full  pb-60;
    @apply h-[calc(100vh_+_3.75rem)];
    background-image: url(@/assets/images/official/bg-hero.png);
    background-position: right 35% bottom 45%;
    object-fit: cover;
    background-size: cover;
    background-repeat: no-repeat;
    text-align: center;
  }
}
</style>
