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
          <div>Contact Us</div>
          <div>official@vida.contact</div>
        </div>
        <div class="official-footer-social-infos-info">
          <div>Address</div>
          <div>Dawson House 5 Jewry St, London</div>
        </div>
      </div>
    </div>

    <Divider class="py-2" />

    <div class="official-footer-policys">
      <div class="official-footer-policys-first">
        <div>Term of Service Effective</div>
        <div>Privacy policy</div>
        <div>18 USC 2257 Statement</div>
        <div>DMCA</div>
      </div>
    </div>
    <div class="official-footer-policys-second">
      <div class="official-footer-policys">
        <div>Acceptable Use Policy</div>
        <div>Cookie Policy</div>
        <div>Complaints Policy</div>
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
