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
    <div class="academy-media">
      <img src="@/assets/images/official/landing-academy.png" alt="Vida Academy" />
    </div>
    <div class="academy-bar">
      <div class="academy-bar-line"></div>
    </div>
    <div class="academy-content">
      <div class="academy-content-title">{{ academy.title }}</div>
      <div class="academy-content-subtitle">{{ academy.subtitle }}</div>
      <div class="academy-content-description">{{ academy.description }}</div>
      <div class="academy-content-button">Explore</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.academy {
  @apply bg-primary px-16 py-64 text-white;
  &-media {
    img {
      max-width: 100%;
      object-fit: cover;
    }
  }
  &-bar {
    @apply w-full py-20;
    &-line {
      @apply mx-auto h-9 w-[70%] rounded bg-white;
    }
  }
  &-content {
    @apply mx-auto flex max-w-[80%] flex-col items-start justify-start;
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
</style>
