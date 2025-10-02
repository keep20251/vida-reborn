<template>
  <article
    class="flex flex-col w-full space-y-10"
    :class="{ 'cursor-pointer': !disableToDetail }"
    @click="() => disableToDetail || $toFeed()"
  >
    <!-- head -->
    <div class="flex items-center w-full h-30">
      <Link class="mr-10" :href="`/${item.user?.username}`" @click.stop="$toCreator(item.user?.username)">
        <Avatar :radius="15" :src="item.user?.thumb"></Avatar>
      </Link>
      <div class="mr-10 text-base font-bold leading-none line-clamp-1">
        <Link class="hover:underline" :href="`/${item.user?.username}`" @click.stop="$toCreator(item.user?.username)"
          >{{ item.user?.nickname }}
        </Link>
      </div>
      <div class="flex items-center justify-end mr-10 grow">
        <div class="w-20 h-20" @click.stop="copy(item.share_url)">
          <Icon name="link" size="20"></Icon>
        </div>
      </div>
      <div class="text-sm font-medium leading-5 text-right line-clamp-1 shrink-0 text-gray-57">{{ postTime }}</div>
      <div
        v-if="editMode || (!isVisitor && !isSelf)"
        class="relative flex items-center cursor-pointer select-none"
        ref="moreToggler"
      >
        <Icon name="moreVertical" size="20" @click.stop="toggleMorePanel"></Icon>
        <transition
          enter-active-class="transition-transform duration-100 ease-out origin-top"
          enter-from-class="transform scale-y-0"
          enter-to-class="transform scale-y-100"
          leave-active-class="transition-transform duration-100 ease-out origin-top"
          leave-from-class="transform scale-y-100"
          leave-to-class="transform scale-y-0"
        >
          <div
            v-if="showMorePanel"
            class="absolute z-10 py-4 bg-white rounded-sm right-16 top-full min-w-max drop-shadow"
            ref="morePanel"
          >
            <div
              class="flex items-center py-6 space-x-5 cursor-pointer px-26 hover:bg-primary hover:text-white"
              @click.stop="onMore1"
            >
              <div class="text-base">{{ more1Text }}</div>
            </div>
            <div
              class="flex items-center py-6 space-x-5 cursor-pointer px-26 hover:bg-primary hover:text-white"
              @click.stop="onMore2"
            >
              <div class="text-base">{{ more2Text }}</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- media -->
    <div class="relative inline-block w-full rounded-md cursor-auto" @click.stop>
      <div class="mt-[60%]"></div>
      <div class="absolute top-0 left-0 w-full h-full rounded-inherit">
        <BlockMask v-if="isBlock" :item="item"></BlockMask>
        <VideoWrap v-else-if="isVideo" :item="item" :stat="!disableStat" :preview="preview"></VideoWrap>
        <PhotoSwiper v-else-if="isImage" :item="item" :stat="!disableStat" :preview="preview"></PhotoSwiper>
      </div>
      <div
        v-if="editMode && [FEED_STATUS.REVIEW, ...FEED_STATUS_FORMATING].includes(item.status)"
        class="absolute top-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 rounded-inherit"
      >
        <span class="text-lg font-bold text-white select-none drop-shadow-md">{{
          item.status === FEED_STATUS.REVIEW ? $t('info.underReview') : $t('info.formating')
        }}</span>
      </div>
      <div v-if="showAutoPublishTime" class="absolute text-base font-bold text-white left-20 top-20">
        {{ $t('content.autoPublishAt', { datetime: tsSecondToYMDhm(item.display_ts, item.display_at) }) }}
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-32 select-none">
      <div class="flex space-x-10 cursor-pointer" @click.stop="toggleLike(item)">
        <Icon :name="item.is_liked ? 'like' : 'likeOutline'" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.like_num }}</div>
      </div>
      <div class="flex space-x-10 cursor-pointer">
        <Icon name="comment" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.comment_num }}</div>
      </div>
      <div class="flex space-x-10 cursor-pointer" @click.stop="copy(item.share_url)">
        <Icon name="sharePost" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.share_num }}</div>
      </div>
      <div class="flex space-x-10">
        <Icon name="play" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.view_num }}</div>
      </div>
      <div v-if="editMode" class="flex space-x-10">
        <Icon name="mineSetPw" size="20"></Icon>
        <div class="text-sm font-medium leading-5">{{ item.buy }}</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-base font-bold leading-none">{{ item.title }}</div>
      <div>
        <div class="flex flex-wrap space-x-5 select-none">
          <Link
            v-for="(tag, i) in tags"
            :key="i"
            :href="`/search?q=${tag}`"
            class="text-base leading-lg text-primary"
            @click.stop="$toTagSearch(tag)"
            >#{{ tag.length > 20 ? tag.substring(0, 20) + '...' : tag }}</Link
          >
        </div>
        <p
          class="text-base break-words whitespace-pre-wrap leading-lg"
          :class="{ 'line-clamp-2': contentFold }"
          ref="content"
          @click="toggleContentFold"
        >
          {{ item.content }}
        </p>
        <div
          v-if="showContentMore"
          class="text-base text-right select-none leading-lg text-gray-57"
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
import { onClickOutside, useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useFeedStore } from '@/store/feed'
import { useFeedDialogStore } from '@/store/feed-dialog'
import Link from '@comp/common/Link.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import BlockMask from '@comp/multimedia/BlockMask.vue'
import PhotoSwiper from '@comp/multimedia/PhotoSwiper.vue'
import VideoWrap from '@comp/multimedia/VideoWrap.vue'
import { useDissSomeone } from '@use/feed/dissSomeone'
import { useRouters } from '@use/routers'
import { useCopyToClipboard } from '@use/utils/copyToClipboard'
import { FEED_STATUS, FEED_STATUS_FORMATING, MEDIA_TYPE } from '@const/publish'
import { commaSplittedToArray, tsSecondToHumanString, tsSecondToYMDhm } from '@/utils/string-helper'

const props = defineProps({
  item: { type: Object, required: true },
  disableToDetail: { type: Boolean, default: false },
  disableContentFold: { type: Boolean, default: false },
  editMode: { type: Boolean, default: false },
  showAutoPublishTime: { type: Boolean, default: false },
  disableStat: { type: Boolean, default: false },
  preview: { type: Boolean, default: false },
})

const emits = defineEmits('edit', 'delete', 'click:creator', 'click:tag')
function $toCreator(username) {
  toCreator(username)
  emits('click:creator')
}
function $toTagSearch(tag) {
  to('search', { query: { q: tag } })
  emits('click:tag')
}

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

const { open: openFeedDialog } = useFeedDialogStore()
const { isMobile } = storeToRefs(useAppStore())
const $toFeed = () =>
  isMobile.value
    ? toFeed(props.item.user.username, props.item.id)
    : openFeedDialog({ feedId: props.item.id, username: props.item.user.username })

const { toggleLike: $toggleLike } = useFeedStore()
const toggleLike = afterLoginAction($toggleLike)

const { copy } = useCopyToClipboard()

const moreToggler = ref(null)
const morePanel = ref(null)
const showMorePanel = ref(false)
onClickOutside(morePanel, () => (showMorePanel.value = false), { ignore: [moreToggler] })
const toggleMorePanel = () => (showMorePanel.value = !showMorePanel.value)
const isBlocked = computed(() => props.item.user.is_block)
const { report, block } = useDissSomeone(props.item.user, () => (showMorePanel.value = false))

const more1Text = computed(() => (props.editMode ? $t('label.edit') : $t('label.report')))
const more2Text = computed(() => (props.editMode ? $t('label.delete') : isBlocked.value ? $t('content.unblock') : $t('label.block'))) // prettier-ignore
function onMore1() {
  showMorePanel.value = false
  props.editMode ? emits('edit') : report()
}
function onMore2() {
  showMorePanel.value = false
  props.editMode ? emits('delete') : block(isBlocked.value)
}
</script>
