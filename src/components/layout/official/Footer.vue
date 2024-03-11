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

    <Divider class="py-2 sm:hidden" />

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
  @apply grid-cols-12 bg-[#FFFFFF] px-10 py-40 leading-10 sm:grid;
  &-social {
    @apply py-40 sm:col-span-4 sm:col-start-3 sm:mx-auto sm:min-w-[400px];
    &-icons {
      @apply flex justify-center space-x-15 sm:justify-start;
      > div {
        @apply rounded-full;
      }
    }
    &-infos {
      @apply pt-30;
      &-info {
        @apply flex justify-around   sm:justify-start;

        :first-child {
          @apply font-bold sm:mr-auto;
        }
        :last-child {
          @apply font-light;
        }
      }
    }
  }
  &-policys {
    @apply flex flex-col text-center font-light  sm:col-span-2 sm:col-start-4 md:col-start-8;
    &-first {
      @apply pt-30;
    }
    &-second {
      @apply sm:pt-30;
    }
  }
}
</style>
