<template>
  <div class="flex flex-col space-y-10">
    <div class="text-sm font-normal leading-3 text-gray-57">完全符合支付卡行业数据安全标准</div>
    <div>
      <form>
        <div id="stripe-element"></div>
        <button class="hidden" type="submit"></button>
      </form>
    </div>
    <div></div>
    <div class="flex flex-row space-x-10">
      <div v-for="image in images" :key="`credit-card-${image.alt}`">
        <img :src="image.src" :alt="image.src" />
      </div>
    </div>
    <div class="text-xs font-medium leading-3 text-gray-57">
      Ripple Mic Limited, Apartment 206, Jantzen House, Ealing Road, Brentford,England, TW8 0GF
    </div>
  </div>
</template>
<script setup>
import Discover from '@/assets/images/payment/credit-card/discover.png'
import JCB from '@/assets/images/payment/credit-card/jcb.png'
import Maestro from '@/assets/images/payment/credit-card/maestro.png'
import MasterCard from '@/assets/images/payment/credit-card/master-card.png'
import Visa from '@/assets/images/payment/credit-card/visa.png'

const images = [
  { src: Discover, alt: 'Discover' },
  { src: JCB, alt: 'JCB' },
  { src: Maestro, alt: 'Maestro' },
  { src: MasterCard, alt: 'MasterCard' },
  { src: Visa, alt: 'Visa' },
]
</script>
