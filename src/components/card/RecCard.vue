<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="itemKey ? item[itemKey] : index"
      class="border-gray15 flex items-center justify-between border-b pb-20 pt-20 first:pt-0 last:border-0 last:pb-0"
    >
      <div class="flex gap-x-10">
        <div class="h-30 w-30 rounded-full bg-lime-700"></div>
        <div class="flex flex-col gap-y-5">
          <div class="flex gap-x-5">
            <div class="text-base font-bold leading-[0.875rem]">{{ item.creator_name }}</div>
            <div class="text-sm font-normal leading-[0.75rem]">@{{ item.creator_acc }}</div>
          </div>
          <div class="flex items-end gap-x-5">
            <div class="text-sm font-normal leading-[0.75rem] text-gray66">{{ item.posts }} posts</div>
            <div class="text-sm font-normal leading-[0.75rem] text-gray66">•</div>
            <div class="text-sm font-normal leading-[0.75rem] text-gray66">{{ item.sub_member }}位订阅会员</div>
          </div>
        </div>
      </div>
      <button
        class="flex items-center justify-center rounded-full bg-contrast px-14 py-6 text-sm font-normal leading-[0.75rem] text-white"
      >
        查看
      </button>
    </div>
  </div>
</template>
<script setup>
defineProps({
  items: { type: Array, require: true },
  itemKey: { type: String },
})
</script>
