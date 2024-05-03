<template>
  <article
    class="flex w-full flex-col space-y-10"
    :class="{ 'cursor-pointer': !disableToDetail }"
    @click="() => disableToDetail || toFeed(item.user.username, item.id)"
  >
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <Link class="mr-10" :href="`/${item.user?.username}`" @click.stop="toCreator(item.user.username)">
        <Avatar :radius="15" :src="item.user?.thumb"></Avatar>
      </Link>
      <div class="mr-10 line-clamp-1 text-base font-bold leading-none">
        <Link class="hover:underline" :href="`/${item.user?.username}`" @click.stop="toCreator(item.user?.username)"
          >{{ item.user?.nickname }}
        </Link>
      </div>
      <div class="mr-10 flex grow items-center justify-end">
        <div class="h-20 w-20" @click.stop="copy(item.share_url)">
          <Icon name="link" size="20"></Icon>
        </div>
      </div>
      <div class="line-clamp-1 shrink-0 text-right text-sm font-medium leading-5 text-gray-57">{{ postTime }}</div>
      <div v-if="!isVisitor && !isSelf" class="flex cursor-pointer items-center" @click.stop="dissSomeone(item.user)">
        <Icon name="moreVertical" size="20"></Icon>
      </div>
    </div>

    <!-- media -->
    <div class="relative inline-block w-full cursor-auto rounded-md" @click.stop>
      <div class="mt-[60%]"></div>
      <div class="absolute left-0 top-0 h-full w-full rounded-inherit">
        <BlockMask v-if="isBlock" :item="item"></BlockMask>
        <VideoWrap v-else-if="isVideo" :item="item"></VideoWrap>
        <PhotoSwiper v-else-if="isImage" :item="item"></PhotoSwiper>
      </div>
      <div v-if="showAutoPublishTime" class="absolute left-20 top-20 text-base font-bold text-white">
        {{ $t('content.autoPublishAt', { datetime: tsSecondToYMDhm(item.display_ts, item.display_at) }) }}
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 select-none space-x-32">
      <div class="flex cursor-pointer space-x-10" @click.stop="toggleLike(item)">
        <Icon :name="item.is_liked ? 'like' : 'likeOutline'" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.like_num }}</div>
      </div>
      <div class="flex cursor-pointer space-x-10">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.comment_num }}</div>
      </div>
      <div class="flex cursor-pointer space-x-10" @click.stop="copy(item.share_url)">
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
        <div class="flex select-none flex-wrap space-x-5">
          <Link
            v-for="(tag, i) in tags"
            :key="i"
            :href="`/search?q=${tag}`"
            class="text-base leading-lg text-primary"
            @click.stop="to('search', { query: { q: tag } })"
            >#{{ tag.length > 20 ? tag.substring(0, 20) + '...' : tag }}</Link
          >
        </div>
        <p
          class="whitespace-pre-wrap break-words text-base leading-lg"
          :class="{ 'line-clamp-2': contentFold }"
          ref="content"
          @click="toggleContentFold"
        >
          {{ item.content }}
        </p>
        <div
          v-if="showContentMore"
          class="select-none text-right text-base leading-lg text-gray-57"
          @click="toggleContentFold"
        >
          more
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import { useFeedStore } from '@/store/feed'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import BlockMask from '@comp/multimedia/BlockMask.vue'
import PhotoSwiper from '@comp/multimedia/PhotoSwiper.vue'
import VideoWrap from '@comp/multimedia/VideoWrap.vue'
import { useRouters } from '@use/routers'
import { useCopyToClipboard } from '@use/utils/copyToClipboard'
import { MEDIA_TYPE } from '@const/publish'
import { commaSplittedToArray, tsSecondToHumanString, tsSecondToYMDhm } from '@/utils/string-helper'

const props = defineProps({
  item: { type: Object, required: true },
  disableToDetail: { type: Boolean, default: false },
  disableContentFold: { type: Boolean, default: false },
  showAutoPublishTime: { type: Boolean, default: false },
})

const accountStore = useAccountStore()
const { userId, isVisitor } = storeToRefs(accountStore)
const { afterLoginAction } = accountStore

const { t: $t } = useI18n()

const isSelf = computed(() => props.item.aff === userId.value)
const isBlock = computed(() => props.item.user.is_block)
const isVideo = computed(() => props.item.resource_type === MEDIA_TYPE.VIDEO)
const isImage = computed(() => props.item.resource_type === MEDIA_TYPE.IMAGE)
const tags = computed(() => commaSplittedToArray(props.item.tags))
const postTime = computed(() => {
  const v = tsSecondToHumanString(props.item.created_ts, props.item.created_at)
  return typeof v === 'string' ? v : $t(v.key, v.values)
})

const content = ref(null)
const showContentMore = ref(false)
useResizeObserver(content, () => (showContentMore.value = content.value.scrollHeight > content.value.clientHeight))

const contentFold = ref(!props.disableContentFold)
function toggleContentFold(evt) {
  if (props.disableContentFold) {
    return
  }
  if (showContentMore.value) {
    evt.stopPropagation()
  }
  contentFold.value = !contentFold.value
}

const { to, toCreator, toFeed } = useRouters()

const { toggleLike: $toggleLike } = useFeedStore()
const toggleLike = afterLoginAction($toggleLike)

const { copy } = useCopyToClipboard()
const { dissSomeone } = useDialogStore()
</script>
