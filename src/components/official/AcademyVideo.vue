<template>
  <div class="mr-10 mt-10 flex select-none flex-col space-y-10">
    <div
      class="max-h-[155] min-h-[101px] min-w-[168px] max-w-[255] cursor-pointer rounded-md border-[5px] border-primary"
      :class="{ 'rounded-lg border-white': border }"
    >
      <img
        src="@/assets/images/official/academy/video.png"
        class="h-full w-full rounded-md object-cover"
        alt="Academy Video"
      />
    </div>
    <div class="max-w-[264px] text-md font-bold leading-5 text-white">{{ title }}</div>
  </div>
</template>
<script setup>
defineProps({
  title: { type: String, default: '' },
  border: { type: Boolean, default: false },
})
</script>
