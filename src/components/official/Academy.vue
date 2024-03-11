<script setup>
import { ref } from 'vue'

const academy = ref({
  title: 'Vida Academy',
  subtitle: 'Boosting your Vida account on social media',
  description:
    'Welcome to Vida Academy! Our virtual academy has been specifically designed for creators. Join today for access to a wealth of knowledge and guidance to help you accelerate your creative endeavours and maximise your monetisation potential.  So, if you’re eager to unlock your creative potential, refine your skills, and turn your passion into a successful enterprise, you’ve come to the right place. Join our community of like-minded individuals, and let’s embark on this exciting creative journey together! Sign up today to begin your learning adventure with us and click the notification bell icon to be notified about key announcements.',
  button: 'Explore',
})
</script>
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
        <div class="academy-wrapper-content-title">{{ academy.title }}</div>
        <div class="academy-wrapper-content-subtitle">{{ academy.subtitle }}</div>
        <div class="academy-wrapper-content-description">{{ academy.description }}</div>
        <div class="academy-wrapper-content-button">Explore</div>
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
