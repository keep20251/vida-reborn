<script setup></script>

<template>
  <div class="official-about">
    <div class="official-about-content">
      <div class="official-about-content-img"></div>
      <div class="official-about-content-title">About Vida</div>
      <div class="official-about-content-info">
        Vida is a ground-breaking member subscription platform designed exclusively for creators, empowering them to
        connect with their fans and effectively monetise their content. We provide a comprehensive suite of services for
        our creators, including crowdfunding capabilities, strategic brand consultations and mentoring services. We have
        a wide range of membership packages to choose from, so no matter what your goals are, Vida enables you to
        achieve them.
      </div>
    </div>

    <div class="official-about-search">
      <div class="official-about-search-input"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.official-about {
  @apply mt-60 h-[calc(100vh_-_3.75rem)];
  @apply flex  items-start justify-center space-y-20;
  &-content {
    @apply mt-60 flex flex-col  items-center justify-center p-100;

    &-img {
      width: 6.25em;
      height: 3.75em;
      background-image: url(@/assets/images/official/icon.svg);
      background-position: center;
      object-fit: cover;
      background-repeat: no-repeat;
    }
    &-title {
      @apply py-15 text-[2.56em] font-bold;
      letter-spacing: 0.02em;
      word-spacing: 0.1em;
      line-height: 1.1;
      word-wrap: break-word;
    }
    &-info {
      @apply pt-20 text-center font-normal leading-6 text-gray-57;
      max-width: 47.563em;
      word-wrap: break-word;
    }
  }
  &-search {
    @apply absolute right-0 top-0;
    &-input {
      @apply h-100 w-100;
    }
  }
}
</style>
