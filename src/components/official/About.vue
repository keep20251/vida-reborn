<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useSearchStore } from '@/store/search'
import TopSearchBar from '@comp/navigation/TopSearchBar.vue'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const searchStore = useSearchStore()
const { activeTab, nextAction, keyword } = storeToRefs(searchStore)
</script>

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
      <div class="official-about-search-input">
        <TopSearchBar :input-value="keyword" :logo="isMobile" to-search @search="(v) => (keyword = v)"></TopSearchBar>
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
