<template>
  <div class="flex flex-row items-center space-x-10">
    <BaseOutline :outlined="defaulted && !disabled">
      <template #default>
        <div
          class="text-sm"
          :class="{
            'text-gray-57': defaulted,
            'text-gray-a3': !defaulted,
          }"
        >
          {{ brand }} **** **** **** {{ last4 }}
        </div>
        <div v-if="disabled" class="absolute right-12 top-0 flex h-full items-center justify-center">
          <span class="text-sm font-normal leading-3 text-gray-a3">{{ $t('info.invalidCard') }}</span>
        </div>
        <div v-if="defaultable && !disabled" class="absolute right-5 top-5" @click="$emit('card:set-default')">
          <button class="rounded-xl bg-primary px-10 py-6 text-white">{{ $t('common.setDefault') }}</button>
        </div>
        <div v-if="selected" class="absolute right-20 top-14">
          <Icon name="checkPrimary" size="11"></Icon>
        </div>
      </template>
    </BaseOutline>
    <div v-if="removable" class="flex items-center" @click="$emit('card:remove')">
      <Icon name="mineSetDelAcc" size="20" class="cursor-pointer"></Icon>
    </div>
  </div>
</template>
<script setup>
import BaseOutline from '../common/BaseOutline.vue'

defineProps({
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  selected: { type: Boolean, default: false },
  defaulted: { type: Boolean, default: false },
  removable: { type: Boolean, default: false },
  defaultable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['card:remove', 'card:set-default'])
</script>
