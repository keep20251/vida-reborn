<template>
  <div class="flex flex-col space-y-20">
    <div class="flex flex-col space-y-10">
      <div class="flex items-center justify-between">
        <div class="text-base font-normal leading-lg">
          <span class="text-xl font-bold leading-xl">{{ props.item.price }}</span> /
          {{ $t('unit.day', { days: props.item.expire_days }) }}
        </div>
        <div class="text-base font-bold leading-md text-subscribe-orange">{{ props.item.name }}</div>
      </div>
      <div class="h-[11.875rem]">
        <EncryptImage :src="props.item.picture" :borderRadius="15" cover></EncryptImage>
      </div>
      <div>
        <div class="relative text-sm font-medium leading-normal text-gray-a3" @click="() => (fold = !fold)">
          <p :class="{ 'line-clamp-3': fold, 'pr-[5%]': fold }">{{ props.item.content }}</p>
          <span v-show="fold" class="absolute bottom-0 right-0 cursor-pointer text-black">{{ $t('common.more') }}</span>
        </div>
      </div>
    </div>
    <Button gradient>{{ $t('common.subscribe') }}</Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      id: 0,
      name: '測試訂閱方案',
      content:
        '高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます 高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます高解像度版５ｋ妻クセルでお楽しみいただけます また、マニア向けのシチュなども１０００円プラン限定で公開してます',
      expire_days: 30,
      price: 9.99,
      picture: '',
    }),
  },
})

const fold = ref(true)
</script>
