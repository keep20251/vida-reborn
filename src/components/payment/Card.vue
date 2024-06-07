<template>
  <div class="flex flex-row items-center space-x-10">
    <BaseOutline :outlined="selected">
      <template #default>
        <div class="text-sm text-gray-a3">{{ brand }} **** **** **** {{ last4 }}</div>
        <div v-if="defaultable" class="absolute right-5 top-5" @click="$emit('crad:set-default')">
          <button class="rounded-xl bg-primary px-10 py-6 text-white">{{ $t('common.setDefault') }}</button>
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
  // TODO 等後端出完資料之後應該要改成用 card 資料物件
  brand: { type: String, required: true },
  last4: { type: String, required: true },
  selected: { type: Boolean, default: false },
  removable: { type: Boolean, default: false },
  defaultable: { type: Boolean, default: false },
})

defineEmits(['card:remove', 'crad:set-default'])
</script>
