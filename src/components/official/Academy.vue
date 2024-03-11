<template>
  <div class="academy">
    <div class="academy-wrapper">
      <div class="academy-wrapper-media">
        <img src="@/assets/images/official/landing-academy.png" alt="Vida Academy" />
      </div>
      <div class="academy-wrapper-bar">
        <div class="academy-wrapper-bar-line"></div>
      </div>
      <div class="academy-wrapper-content">
        <div class="academy-wrapper-content-title">
          {{ $t('official.academy.title') }}
        </div>
        <div class="academy-wrapper-content-subtitle">
          {{ $t('official.academy.subtitle') }}
        </div>
        <div class="academy-wrapper-content-description">
          {{ $t('official.academy.info') }}
        </div>
        <a href="/official/academy" class="academy-wrapper-content-button">
          {{ $t('official.academy.btn') }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.academy {
  @apply bg-primary px-16 py-64 text-white;
  .academy-wrapper {
    @apply mx-auto sm:grid sm:max-w-[1440px] sm:grid-cols-12;

    &-media {
      @apply sm:col-span-7;
      img {
        max-width: 100%;
        object-fit: cover;
      }
    }
    &-bar {
      @apply w-full py-20 sm:col-span-1 sm:flex;
      &-line {
        @apply mx-auto h-9 w-[70%] rounded bg-white;
        @apply bg-white  sm:my-auto sm:h-[60%] sm:w-12;
      }
    }
    &-content {
      @apply mx-auto flex max-w-[80%] flex-col items-start justify-start sm:col-span-4;
      &-title {
        @apply w-full pt-10 text-center text-[30px] font-bold;
        letter-spacing: 0.05em;
      }
      &-subtitle {
        @apply pt-20 text-[20px] font-light;
      }
      &-description {
        @apply pt-20 text-[16px] font-light;
      }
      &-button {
        @apply mt-40 rounded-full  bg-contrast px-25 py-2 text-white;
      }
    }
  }
}
</style>
