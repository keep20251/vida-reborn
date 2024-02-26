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
        <div class="text-sm font-medium leading-normal text-gray-a3" @click.stop="toggleFold">
          <p :class="{ 'line-clamp-3': fold }" ref="content">{{ props.item.content }}</p>
        </div>
        <div
          v-show="showContentMore"
          class="cursor-pointer select-none text-right text-sm font-medium leading-normal text-gray-a3"
          @click.stop="toggleFold"
        >
          {{ $t('common.more') }}
        </div>
      </div>
    </div>
    <Button gradient @click="emit('click', props.item)">{{ $t('common.subscribe') }}</Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import Button from '@comp/common/Button.vue'

const emit = defineEmits(['click'])

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

const content = ref(null)
const showContentMore = ref(false)
useResizeObserver(content, () => (showContentMore.value = content.value.scrollHeight > content.value.clientHeight))

function toggleFold() {
  fold.value = !fold.value
}
</script>
