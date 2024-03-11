<script setup></script>

<template>
  <div class="official-joinus">
    <!-- TODO: 輪播 -->
    <div class="official-joinus-bg"></div>
    <div class="official-joinus-info">
      <div class="official-joinus-info-container">
        <h1>{{ $t('official.joinUs.title') }}</h1>
        <h2>{{ $t('official.joinUs.subtitle') }}</h2>
        <div class="info">
          {{ $t('official.joinUs.info') }}
        </div>
        <a href="/mine/creator" class="btn">{{ $t('official.joinUs.btn') }}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.official-joinus {
  @apply relative z-auto mx-auto flex h-screen w-full flex-col  justify-end sm:items-center sm:justify-center;

  &-bg {
    @apply absolute inset-0 z-0;
    max-width: 100%;
    height: 100%;
    background-image: url(@/assets/images/official/join-us.png);
    background-position: center;
    object-fit: cover;
    background-repeat: no-repeat;
  }
  &-info {
    @apply z-10 my-60 flex flex-col items-end text-white sm:w-2/3;
    &-container {
      font-size: 1.5rem;
      @apply flex flex-col px-20 sm:max-w-md;

      h1 {
        @apply font-bold;

        font-size: 2.5rem;
      }
      h2 {
        font-size: 1.563rem;
      }
      .info {
        @apply mt-54;
        font-size: 1rem;
        line-height: 1.5;
      }
      //select clsss btn
      .btn {
        @apply ml-auto mt-54 cursor-pointer rounded-full  bg-primary px-20 py-10 text-lg font-bold text-white sm:ml-0;
        width: fit-content;
      }
    }
  }
}
</style>
