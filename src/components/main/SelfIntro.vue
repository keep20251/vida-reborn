<template>
  <div class="-mx-20 sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
    <div class="relative mb-35 flex h-[180px] w-full bg-gray-57 bg-cover bg-center bg-no-repeat">
      <EncryptImage v-if="coverBg || item.background" :src="coverBg || item.background" cover></EncryptImage>
      <div v-else class="h-full w-full rounded-inherit bg-gray-f6">
        <img class="h-full w-full rounded-inherit" src="@/assets/images/default-bg.jpg?url" alt="DefaultAvatar" />
      </div>
      <div
        v-if="showBgUpload"
        class="absolute left-1/2 top-1/2 w-full -translate-x-2/4 -translate-y-2/4 cursor-pointer"
        @click="() => inputBackground.click()"
      >
        <div class="flex justify-center">
          <div class="text-sm font-normal leading-3 text-white">{{ $t('info.clickToUploadBg') }}</div>
        </div>
      </div>
      <div v-if="showBgData" class="absolute left-1/2 top-1/2 w-full -translate-x-2/4 -translate-y-2/4">
        <div class="flex justify-around">
          <div v-if="false" class="flex w-[175px] flex-col items-center space-y-5">
            <p class="text-xl font-bold leading-xl text-white drop-shadow-lg">{{ item.subscriber_count }}</p>
            <p class="text-sm font-normal leading-3 text-white drop-shadow-lg">{{ $t('info.perSubscriber') }}</p>
          </div>
          <div v-if="false" class="h-25 w-1 bg-[#DCDCDC]"></div>
          <div class="flex w-[175px] flex-col items-center space-y-5">
            <p class="text-xl font-bold leading-xl text-white drop-shadow-lg">{{ item.post_num }}</p>
            <p class="text-sm font-normal leading-3 text-white drop-shadow-lg">{{ $t('info.perPost') }}</p>
          </div>
        </div>
      </div>
      <div class="absolute -bottom-35 flex h-70 w-full px-20">
        <Avatar
          :radius="35"
          :src="coverAvatar || item.thumb"
          :cameraIcon="cameraIcon"
          @click:camera="() => inputAvatar.click()"
        ></Avatar>
      </div>
      <div class="absolute -bottom-50 right-0 mr-20 flex w-full justify-end sm:mr-0 xl:mr-0">
        <slot name="topButton"></slot>
      </div>
    </div>
    <div v-if="showAllInfo" class="mx-20 grid space-y-10 pt-30 sm:ml-0 sm:mr-0 xl:ml-0 xl:mr-0">
      <div class="flex items-end justify-between">
        <div class="flex items-end space-x-5">
          <div class="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-lg">
            {{ item.nickname }}
          </div>
          <div class="text-sm font-normal leading-3 text-gray-57">＠{{ item.username }}</div>
        </div>
        <slot name="middleButton"></slot>
      </div>
      <div v-if="showPersonalInfo" class="grid space-y-10">
        <div class="flex items-end space-x-5">
          <div class="text-sm font-normal leading-3 text-gray-57">{{ item.view_count }} {{ $t('content.view') }}</div>
        </div>
        <p
          class="select-none text-base font-normal leading-lg"
          :class="{ 'line-clamp-3': contentFold }"
          ref="content"
          @click.stop="toggleContentFold"
        >
          {{ item.description }}
        </p>
        <div
          v-show="showContentMore"
          class="cursor-pointer select-none text-right text-base font-normal leading-lg"
          @click.stop="toggleContentFold"
        >
          {{ $t('common.more') }}
        </div>
      </div>
    </div>
    <div v-if="$slots['bottomButton']" class="my-20 flex space-x-10" :class="{ 'mx-20': isMobile }">
      <slot name="bottomButton"></slot>
    </div>
    <input
      type="file"
      accept="image/jpg, image/jpeg, image/png, image/gif"
      hidden
      ref="inputAvatar"
      @change="(e) => emits('file:avatar', e.target.files[0])"
    />
    <input
      type="file"
      accept="image/jpg, image/jpeg, image/png, image/gif"
      hidden
      ref="inputBackground"
      @change="(e) => emits('file:background', e.target.files[0])"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import Avatar from '@comp/multimedia/Avatar.vue'

const emits = defineEmits(['file:avatar', 'file:background'])

defineProps({
  item: { type: Object, required: true },
  showBgUpload: { type: Boolean, default: false },
  showBgData: { type: Boolean, default: false },
  showPersonalInfo: { type: Boolean, default: false },
  showAllInfo: { type: Boolean, default: false },
  cameraIcon: { type: Boolean, default: false },

  // 用於上傳圖片暫時取代原本的圖片
  coverBg: { type: String, default: null },
  coverAvatar: { type: String, default: null },
})

const inputAvatar = ref(null)
const inputBackground = ref(null)

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const content = ref(null)
const showContentMore = ref(false)
useResizeObserver(content, () => (showContentMore.value = content.value.scrollHeight > content.value.clientHeight))

const contentFold = ref(true)
function toggleContentFold() {
  contentFold.value = !contentFold.value
}
</script>
