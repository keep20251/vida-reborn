<template>
  <div class="relative h-full w-full rounded-inherit">
    <EncryptImage :src="item.url[0]?.url" :border-radius="10" cover></EncryptImage>
    <div
      class="absolute top-0 flex h-full w-full items-center justify-center rounded-inherit bg-[rgba(0,0,0,0.5)] backdrop-blur"
    >
      <div class="flex flex-col items-center space-y-20">
        <Icon name="block" size="60"></Icon>
        <div class="bg-gray-57 px-20 py-10 text-base font-bold text-white">
          {{ $t('content.blocked', { name: item.user.nickname }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true },
})
</script>
