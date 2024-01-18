<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="itemKey ? item[itemKey] : index"
      class="flex items-center justify-between border-b border-gray15 pb-20 pt-20 first:pt-0 last:border-0 last:pb-0"
    >
      <div class="flex space-x-10">
        <Avatar :radius="30" :src="item.creator_avatar"></Avatar>
        <div class="flex flex-col space-y-5">
          <div class="flex space-x-5">
            <div class="leading-md text-base font-bold">{{ item.creator_name }}</div>
            <div class="text-sm font-normal leading-3">@{{ item.creator_acc }}</div>
          </div>
          <div class="flex items-end space-x-5">
            <div class="text-sm font-normal leading-3 text-gray66">{{ item.posts }} posts</div>
            <div class="text-sm font-normal leading-3 text-gray66">•</div>
            <div class="text-sm font-normal leading-3 text-gray66">{{ item.sub_member }}位订阅会员</div>
          </div>
        </div>
      </div>
      <button
        @click="() => emits('click', index)"
        class="flex items-center justify-center rounded-full bg-contrast px-14 py-6 text-sm font-normal leading-3 text-white"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'

defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
  buttonText: { type: String, default: '查看' },
})

const emits = defineEmits(['click'])
</script>
