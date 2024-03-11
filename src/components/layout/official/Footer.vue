<script setup>
import { ref } from 'vue'
import Divider from '@comp/common/Divider.vue'
import SocialIcon from '@comp/common/SocialIcon.vue'

const socials = ref([
  {
    name: 'tiktok',
    url: 'https://www.google.com.tw/?hl=zh_TW',
    size: '38',
  },
  {
    name: 'twitter',
    url: 'https://www.google.com.tw/?hl=zh_TW',
    size: '38',
  },
  {
    name: 'instagram',
    url: 'https://www.google.com.tw/?hl=zh_TW',
    size: '38',
  },
  {
    name: 'youtube',
    url: 'https://www.google.com.tw/?hl=zh_TW',
    size: '38',
  },
])
</script>
<template>
  <footer class="official-footer" style="height: 100vh" id="contact">
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

    <Divider class="py-2" />

    <div class="official-footer-policys">
      <div class="official-footer-policys-first">
        <div>{{ $t('official.footer.tos') }}</div>
        <div>{{ $t('official.footer.pp') }}</div>
        <div>{{ $t('official.footer.usc') }}</div>
        <div>{{ $t('official.footer.dmca') }}</div>
      </div>
    </div>
    <div class="official-footer-policys-second">
      <div class="official-footer-policys">
        <div>{{ $t('official.footer.aup') }}</div>
        <div>{{ $t('official.footer.cookiePolicy') }}</div>
        <div>{{ $t('official.footer.complaintsPolicy') }}</div>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
.official-footer {
  @apply px-30 py-40 text-sm;
  &-social {
    @apply py-40;
    &-icons {
      @apply flex justify-center space-x-15;
      > div {
        @apply rounded-full;
      }
    }
    &-infos {
      @apply pt-30;
      &-info {
        @apply flex justify-around leading-8;

        :first-child {
          @apply font-bold;
        }
        :last-child {
          @apply font-light;
        }
      }
    }
  }
  &-policys {
    @apply flex flex-col  text-center font-light leading-8;
    font-size: small;
    &-first {
      @apply pt-30;
    }
    &-second {
    }
  }
}
</style>
