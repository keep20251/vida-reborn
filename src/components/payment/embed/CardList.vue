<template>
  <div class="flex flex-col space-y-10">
    <Card brand="Visa" last4="9999"></Card>
    <BaseOutline>
      <template #default>
        <div @click="$emit('add:card')">
          <div class="text-sm text-gray-a3">添加信用卡</div>
          <div class="absolute right-8 top-8">
            <Icon name="dropdown" size="20" style="rotate: 90"></Icon>
          </div>
        </div>
      </template>
    </BaseOutline>
  </div>
</template>
<script setup>
import BaseOutline from '@/components/common/BaseOutline.vue'
import Card from '@/components/payment/Card.vue'

defineEmits(['add:card'])
</script>
