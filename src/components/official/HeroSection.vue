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
  @apply relative flex h-[72vh] w-full sm:h-[calc(100vh_-_10.75rem)];

  &-content {
    @apply relative top-[12%] mx-auto flex h-fit w-full max-w-5xl flex-col  items-center space-x-10 space-y-10 break-words px-36 text-white sm:top-[20%];

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
      @apply w-full px-5 pt-10 text-right text-[2.56em] font-bold sm:max-w-5xl sm:text-center sm:text-[3.5em] lg:w-auto lg:pt-0;
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
      @apply my-0 w-full pr-4 text-end font-bold sm:text-center sm:text-[2em] lg:pt-10;
    }

    &-btns {
      @apply mt-5 flex justify-center space-x-30 pt-40 text-[1.25em] sm:space-x-50;

      a {
        cursor: pointer;
        @apply w-[9.375rem] rounded-full border px-34 py-6 text-center;
      }

      :first-child {
        @apply bg-white text-primary;
      }
      :hover {
        @apply border-primary bg-primary bg-opacity-90 text-white drop-shadow-lg;
      }
    }
  }

  &-bg {
    @apply absolute top-[-25%] w-full sm:-top-100 sm:h-full sm:pb-100;
    @apply h-[90vh] sm:h-[98vh];
    background-image: url(@/assets/images/official/bg-hero.png);
    background-position: right 35% bottom 45%;
    object-fit: cover;
    background-size: cover;
    background-repeat: no-repeat;
    text-align: center;
  }
}
</style>
