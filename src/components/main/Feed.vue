<template>
  <article
    class="flex w-full flex-col space-y-10"
    :class="{ 'cursor-pointer': !disableToDetail }"
    @click="() => disableToDetail || toFeed(item.user.username, item.id)"
  >
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <Link :href="`/${item.user?.username}`" @click.stop="toCreator(item.user.username)">
        <Avatar :radius="15" class="mr-5" :src="item.user?.thumb"></Avatar>
      </Link>
      <div class="text-base font-bold leading-none">
        <Link class="hover:underline" :href="`/${item.user?.username}`" @click.stop="toCreator(item.user?.username)"
          >{{ item.user?.nickname }}
        </Link>
      </div>
      <div class="grow text-right text-sm font-medium leading-5 text-gray-57">{{ item.created_at }}</div>
      <div v-if="!isSelf" class="flex cursor-pointer items-center" @click.stop="dissSomeone(item.user)">
        <Icon name="moreVertical" size="20"></Icon>
      </div>
    </div>

    <!-- media -->
    <div class="relative inline-block w-full rounded-md">
      <div class="mt-[60%]"></div>
      <div class="absolute left-0 top-0 h-full w-full rounded-inherit">
        <LockMedia v-if="isLock" :item="item"></LockMedia>
        <VideoWrap v-if="!isLock && isVideo" :urls="item.url"></VideoWrap>
        <PhotoSwiper v-if="!isLock && isImage" :imgs="item.url"></PhotoSwiper>
      </div>
      <div
        v-if="![FEED_STATUS.PUBLISHED, FEED_STATUS.REJECT].includes(item.status)"
        class="absolute left-20 top-20 text-base font-bold text-white"
      >
        {{ $t('content.autoPublishAt', { datetime: item.display_at }) }}
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 select-none space-x-32">
      <div class="flex cursor-pointer space-x-10" @click.stop="toggleLike(item)">
        <Icon :name="item.is_like ? 'like' : 'likeOutline'" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.like_num }}</div>
      </div>
      <div class="flex cursor-pointer space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.comment_num }}</div>
      </div>
      <div class="flex cursor-pointer space-x-10">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.share_num }}</div>
      </div>
      <div class="flex space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.view_num }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ item.title }}</div>
      <div>
        <div class="flex select-none space-x-5">
          <Link
            v-for="(tag, i) in tags"
            :key="i"
            :href="`/search?q=${tag}`"
            class="text-base leading-lg text-primary"
            @click.stop="to('search', { query: { q: tag } })"
            >#{{ tag }}</Link
          >
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
          class="select-none text-right text-base leading-lg text-gray-57"
          @click.stop="toggleContentFold"
        >
          more
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { useFeedStore } from '@/store/feed'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import LockMedia from '@comp/multimedia/LockMedia.vue'
import PhotoSwiper from '@comp/multimedia/PhotoSwiper.vue'
import VideoWrap from '@comp/multimedia/VideoWrap.vue'
import { useRouters } from '@use/routers'
import { FEED_STATUS, MEDIA_TYPE } from '@const/publish'

const props = defineProps({
  item: { type: Object, required: true },
  disableToDetail: { type: Boolean, default: false },
  disableContentFold: { type: Boolean, default: false },
})

const accountStore = useAccountStore()
const { userId } = storeToRefs(accountStore)

const isSelf = computed(() => props.item.aff === userId.value)
const isLock = computed(() => props.item.user.is_block || !props.item.is_unlock)
// const isLock = computed(() => false) // 把鎖拿掉 debug 用
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

const { to, toCreator, toFeed } = useRouters()

const { toggleLike } = useFeedStore()

const { dissSomeone } = useDialogStore()
</script>
