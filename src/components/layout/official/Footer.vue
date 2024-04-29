<script setup>
import { ref } from 'vue'
import Divider from '@comp/common/Divider.vue'
import SocialIcon from '@comp/common/SocialIcon.vue'

const socialIconSize = '40'

const socials = ref([
  { name: 'tiktok', url: 'https://www.tiktok.com/@vida_platform/', size: socialIconSize },
  { name: 'twitter', url: 'https://twitter.com/vida_platform/', size: socialIconSize },
  { name: 'instagram', url: 'https://www.instagram.com/vida_officialcontact/', size: socialIconSize },
  { name: 'youtube', url: 'https://www.youtube.com/@vida_platform/', size: socialIconSize },
])
</script>
<template>
  <footer class="official-footer" id="contact">
    <div class="official-footer-social">
      <div class="official-footer-social-icons">
        <SocialIcon
          v-for="(social, index) in socials"
          :key="index"
          :name="social.name"
          :url="social.url"
          :size="social.size"
        />
      </div>
      <div class="official-footer-social-infos">
        <div class="official-footer-social-infos-info">
          <div>{{ $t('official.footer.contact') }}</div>
          <div>official@vida.contact</div>
        </div>
        <div class="official-footer-social-infos-info">
          <div>{{ $t('official.footer.address') }}</div>
          <div>Dawson House 5 Jewry St, London</div>
        </div>
      </div>
    </div>

    <Divider class="py-40 lg:hidden" />

    <div class="official-footer-policys-first">
      <div class="official-footer-policys">
        <a href="/official/tos">{{ $t('official.footer.tos') }}</a>
        <a href="/official/privacy-policy">{{ $t('official.footer.pp') }}</a>
        <a href="/official/usc">{{ $t('official.footer.usc') }}</a>
        <a href="/official/dmca">{{ $t('official.footer.dmca') }}</a>
      </div>
    </div>
    <div class="official-footer-policys-second">
      <div class="official-footer-policys">
        <a href="/official/aup">{{ $t('official.footer.aup') }}</a>
        <a href="/official/cookie-policy">{{ $t('official.footer.cookiePolicy') }}</a>
        <a href="/official/complaints-policy">{{ $t('official.footer.complaintsPolicy') }}</a>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.official-footer {
  @apply grid-cols-12 bg-[#FFFFFF] px-10 py-50 leading-10 lg:grid lg:py-40;
  &-social {
    @apply lg:col-span-4 lg:col-start-3 lg:mx-auto lg:min-w-[400px] lg:py-40;
    &-icons {
      @apply flex justify-center space-x-15 lg:justify-start;
      > div {
        @apply rounded-full;
      }
    }
    &-infos {
      @apply pt-25 lg:pt-30;
      &-info {
        @apply mb-10 flex justify-center space-x-12 leading-5 lg:justify-start lg:space-x-15;

        :first-child {
          @apply text-sm font-medium lg:text-md;
        }
        :last-child {
          @apply text-sm lg:text-md;
        }
      }
    }
  }
  &-policys {
    @apply flex flex-col space-y-16 text-center font-light leading-5 lg:col-span-2 lg:col-start-4 lg:text-left;
    &-first {
      @apply lg:col-start-8 lg:pt-30;
    }
    &-second {
      @apply lg:pt-30;
    }
  }
}
</style>
