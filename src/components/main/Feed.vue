<template>
  <div
    class="flex w-full flex-col space-y-10"
    :class="{ 'cursor-pointer': !disableToDetail }"
    @click="() => disableToDetail || toFeed(item.user.username, item.id)"
  >
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <div class="cursor-pointer" @click.stop="toCreator(item.user.username)">
        <Avatar :radius="15" class="mr-5" :src="item.user?.thumb"></Avatar>
      </div>
      <div class="grow text-base font-bold leading-none">
        <span class="cursor-pointer hover:underline" @click.stop="toCreator(item.user.username)"
          >{{ item.user?.nickname }}
        </span>
      </div>
      <div class="grow text-right text-sm font-medium leading-5 text-gray-57">{{ item.created_at }}</div>
      <Icon name="moreVertical" size="20"></Icon>
    </div>

    <!-- media -->
    <div>
      <div class="relative inline-block w-full rounded-md">
        <div class="mt-[60%]"></div>
        <div class="absolute left-0 top-0 h-full w-full rounded-inherit">
          <div v-if="isVideo" class="flex h-full items-center justify-center rounded-inherit">
            <div v-if="!item.url[0] || !item.url[0].url" class="animate-bounce">這筆資料是廢物</div>
            <Video v-else :url="item.url[0].url"></Video>
          </div>
          <EncryptImage v-if="isImage" :src="item.url[0]?.url" :border-radius="10" cover></EncryptImage>
        </div>
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-20">
      <div class="flex grow space-x-10">
        <Icon name="likeOutline" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.like }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.comment }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.share }}</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.view }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ item.title }}</div>
      <div>
        <div class="flex space-x-5">
          <div v-for="(tag, i) in tags" :key="i" class="text-base leading-lg text-primary">#{{ tag }}</div>
        </div>
        <p
          class="whitespace-pre-wrap break-words text-base leading-lg"
          :class="{ 'line-clamp-2': contentFold }"
          ref="content"
          @click.stop="toggleContentFold"
        >
          {{ item.content }}
        </p>
        <div
          v-if="showContentMore"
          class="text-right text-base leading-lg text-gray-57"
          @click.stop="toggleContentFold"
        >
          more
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import Avatar from '@comp/multimedia/Avatar.vue'
import Video from '@comp/multimedia/Video.vue'
import { useRouters } from '@use/routers'
import { MEDIA_TYPE } from '@const/publish'

const props = defineProps({
  item: { type: Object, required: true },
  disableToDetail: { type: Boolean, default: false },
  disableContentFold: { type: Boolean, default: false },
})

const isVideo = computed(() => props.item.resource_type === MEDIA_TYPE.VIDEO)
const isImage = computed(() => props.item.resource_type === MEDIA_TYPE.IMAGE)
const tags = computed(() => (props.item.tags ? props.item.tags.split(',') : []))

const content = ref(null)
const showContentMore = ref(false)
useResizeObserver(content, () => (showContentMore.value = content.value.scrollHeight > content.value.clientHeight))

const contentFold = ref(!props.disableContentFold)
function toggleContentFold() {
  if (props.disableContentFold) {
    return
  }
  contentFold.value = !contentFold.value
}

const { toCreator, toFeed } = useRouters()
</script>
