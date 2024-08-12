<template>
  <div class="flex select-none flex-col space-y-20" @click="onOutsideClicked">
    <div class="flex flex-col space-y-10">
      <div class="flex items-center justify-between">
        <div class="text-base font-normal leading-lg">
          <span class="text-xl font-bold leading-xl">${{ removeDecimalIfHundred(props.item.price) }}</span> /
          {{ $t('unit.day', { days: props.item.expire_days }) }}
        </div>
        <div class="flex flex-row items-center justify-center">
          <span class="text-base font-bold leading-md text-subscribe-orange">
            {{ props.item.name }}
          </span>
          <div v-if="props.editMode" class="relative flex select-none flex-row items-center justify-center">
            <Icon name="moreVertical" size="20" class="cursor-pointer" @click.stop="toggleEditing"></Icon>
            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform scale-0 -translate-y-75 translate-x-75"
              enter-to-class="transform scale-100 translate-y-0 translate-x-0"
              leave-active-class="transition duration-300 ease-out"
              leave-from-class="transform scale-100 translate-y-0 translate-x-0"
              leave-to-class="transform scale-0 -translate-y-75 translate-x-55"
            >
              <div v-show="isEditing" class="absolute right-10 top-20 w-[7.5rem] rounded bg-white">
                <div class="flex flex-col shadow-lg">
                  <div
                    v-for="(editOption, index) in editOptions"
                    :key="`edit-option-${index}`"
                    class="cursor-pointer px-12 py-6 hover:bg-primary hover:text-white"
                    @click.stop="editOption.action"
                  >
                    {{ $t(editOption.label) }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div :class="{ 'h-[11.875rem]': !height }">
        <EncryptImage :src="props.item.picture" :borderRadius="15" cover :height="height"></EncryptImage>
      </div>
      <div class="flex w-full justify-between">
        <div class="text-sm font-normal leading-3 text-gray-a3">
          {{ $t('info.subscription.unlockSubscribe', { days: props.item.unlock_day_after_subscribe }) }}
        </div>
        <div
          v-show="props.showContain"
          class="cursor-pointer text-sm font-normal leading-3 text-primary underline"
          @click.stop="closeEditing(() => emit('click:contain', props.item))"
        >
          {{ $t('info.subscription.containFeeds', { feeds: props.item.article_contain ?? 0 }) }}
        </div>
      </div>
      <div>
        <div class="whitespace-pre-wrap text-sm font-medium leading-normal text-gray-a3" @click.stop="toggleFold">
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
    <Button v-if="!subscriptBtn" gradient @click="onSubscribeClicked">
      {{ item.is_subscribed ? $t('common.subscribed') : $t('common.subscribe') }}
    </Button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import Button from '@comp/common/Button.vue'

const emit = defineEmits([
  'click',
  'click:contain',
  'move:up',
  'move:down',
  'edit',
  'edit:close',
  'delete',
  'update:editing',
])

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
  editMode: { type: Boolean, default: false },
  editTrigger: {},
  subscriptBtn: { type: Boolean, default: false },
  showContain: { type: Boolean, default: false },
  height: { type: Number },
})

const fold = ref(true)

const content = ref(null)
const showContentMore = ref(false)
useResizeObserver(content, () => (showContentMore.value = content.value.scrollHeight > content.value.clientHeight))

function toggleFold() {
  fold.value = !fold.value
}

function removeDecimalIfHundred(value) {
  const num = Number(value) // 因為後端拿回來是字串

  // 判斷是否是百位數以上的整數
  if (!isNaN(num) && Number.isInteger(num) && num >= 100) {
    return Math.trunc(num) // 去掉小數點
  } else {
    return num
  }
}

const isEditing = ref(false)
watch(isEditing, (v) => emit('update:editing', v))

const toggleEditing = () => (isEditing.value = !isEditing.value)
const closeEditing = (fn = null) => {
  isEditing.value = false
  !!fn && fn()
}

const editOptions = [
  { label: 'common.editSubscription.moveUp', action: () => closeEditing(() => emit('move:up', props.item)) },
  { label: 'common.editSubscription.moveDown', action: () => closeEditing(() => emit('move:down', props.item)) },
  { label: 'common.editSubscription.edit', action: () => closeEditing(() => emit('edit', props.item)) },
  { label: 'common.editSubscription.delete', action: () => closeEditing(() => emit('delete', props.item)) },
]

const onOutsideClicked = () => props.editMode && closeEditing()
watch(() => props.editTrigger, onOutsideClicked)

function onSubscribeClicked() {
  if (props.item.is_subscribed) return
  emit('click', props.item)
}
</script>
