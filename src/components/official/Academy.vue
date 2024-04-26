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
  @apply bg-primary px-16 py-50 text-white md:px-[9.375rem] md:py-75;
  .academy-wrapper {
    @apply mx-auto md:grid md:max-w-[1920px] md:grid-cols-12;

    &-media {
      @apply flex items-center md:col-span-7;
      img {
        max-width: 100%;
        object-fit: cover;
      }
    }
    &-bar {
      @apply w-full py-30 md:col-span-1 md:flex;
      &-line {
        @apply mx-auto h-9 w-[70%] rounded bg-white;
        @apply bg-white  md:my-auto md:h-[60%] md:w-12;
      }
    }
    &-content {
      @apply mx-auto flex flex-col items-start justify-start px-38 md:col-span-4 md:justify-center md:px-0;
      &-title {
        @apply w-full text-start text-[30px] font-bold;
        letter-spacing: 0.05em;
      }
      &-subtitle {
        @apply pt-10 text-[20px] font-light;
      }
      &-description {
        @apply pt-30 text-[16px] font-light;
      }
      &-button {
        @apply mt-30 rounded-full  bg-contrast px-25 py-2 text-white;
      }
    }
  }
}
</style>
