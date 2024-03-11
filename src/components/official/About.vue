<script setup>
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'

function toSearch(value) {
  window.location.href = `/search?q=${value}`
}
</script>

<template>
  <div class="official-about">
    <div class="official-about-content">
      <div class="official-about-content-img"></div>
      <div class="official-about-content-title">{{ $t('official.about.title') }}</div>
      <div class="official-about-content-info">
        {{ $t('official.about.info') }}
      </div>
    </div>
    <div class="official-about-search">
      <div class="official-about-search-input">
        <TopSearchBar @search="toSearch"></TopSearchBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.official-about {
  @apply mx-auto my-60 flex  flex-col space-y-20;
  max-width: 47.563em;

  &-content {
    @apply mx-40 mt-90 flex flex-col items-center justify-center;

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
      word-wrap: break-word;
    }
  }
  &-search {
    @apply pt-60;
    &-input {
      @apply mx-40 sm:mx-80;
    }
  }
}
</style>
