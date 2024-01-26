<template>
  <div class="ml-[-20px] mr-[-20px] sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
    <div
      class="bg-gray-57 relative mb-35 flex h-[180px] w-full bg-[url(https://i.postimg.cc/2yKgNXvn/ctrateBg.jpg)] bg-cover bg-center bg-no-repeat"
    >
      <div
        v-if="showBgUpload"
        class="absolute left-1/2 top-1/2 w-full translate-x-[-50%] translate-y-[-50%] cursor-pointer"
      >
        <div class="flex justify-center">
          <div class="text-sm font-normal leading-3 text-white">{{ $t('info.clickToUploadBg') }}</div>
        </div>
      </div>
      <div v-if="showBgData" class="absolute left-1/2 top-1/2 w-full translate-x-[-50%] translate-y-[-50%]">
        <div class="flex justify-around">
          <div class="flex w-[175px] flex-col items-center space-y-5">
            <p class="text-xl font-bold leading-xl text-white">{{ item.subscriber }}</p>
            <p class="text-sm font-normal leading-3 text-white opacity-50">{{ $t('info.perSubscriber') }}</p>
          </div>
          <div class="h-25 w-1 bg-[#DCDCDC]"></div>
          <div class="flex w-[175px] flex-col items-center space-y-5">
            <p class="text-xl font-bold leading-xl text-white">{{ item.posts }}</p>
            <p class="text-sm font-normal leading-3 text-white opacity-50">{{ $t('info.perPost') }}</p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-[-35px] flex h-70 w-full px-20">
        <Avatar :radius="70" :src="defaultAvatar" :cameraIcon="cameraIcon"></Avatar>
      </div>
      <div class="absolute bottom-[-50px] right-0 mr-[20px] flex w-full justify-end sm:mr-0 xl:mr-0">
        <slot name="topButton"></slot>
      </div>
    </div>
    <div v-if="showAllInfo" class="ml-[20px] mr-[20px] grid space-y-10 pt-30 sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
      <div class="flex items-end justify-between">
        <div class="flex items-end space-x-5">
          <div class="text-lg font-bold leading-lg">{{ item.name }}</div>
          <div class="text-gray-57 text-sm font-normal leading-3">＠{{ item.username }}</div>
        </div>
        <slot name="middleButton"></slot>
      </div>
      <div v-if="showPersonalInfo" class="grid space-y-10">
        <div class="flex items-end space-x-5">
          <div class="text-sm font-normal leading-3">{{ $t('info.myLink') }}</div>
          <div class="text-gray-57 text-sm font-normal leading-3">{{ item.link }}</div>
          <div class="text-gray-57 text-sm font-normal leading-3">•</div>
          <div class="text-gray-57 text-sm font-normal leading-3">{{ item.viewed }} {{ $t('content.view') }}</div>
        </div>
        <p class="text-base font-normal leading-lg">{{ item.info }}</p>
      </div>
    </div>
    <div v-if="$slots['bottomButton']" class="my-20 flex space-x-10">
      <slot name="bottomButton"></slot>
    </div>
  </div>
</template>
<script setup>
import Avatar from '@comp/multimedia/Avatar.vue'
import defaultAvatar from '@/assets/images/avatar.jpeg'

defineProps({
  showBgUpload: { type: Boolean, default: false },
  showBgData: { type: Boolean, default: false },
  showPersonalInfo: { type: Boolean, default: false },
  showAllInfo: { type: Boolean, default: false },
  cameraIcon: { type: Boolean, default: false },
  item: {
    type: Object,
    default: () => ({
      subscriber: '',
      posts: '',
      name: '',
      username: '',
      link: '',
      viewed: '',
      info: '',
    }),
  },
})
</script>
