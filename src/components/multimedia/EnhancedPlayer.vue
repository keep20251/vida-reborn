<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-hidden bg-black"
    ref="playerContainer"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @wheel="onWheel"
    @keydown="onKeyDown"
    tabindex="0"
  >
    <!-- 關閉按鈕 -->
    <div class="absolute right-20 top-20 z-10 cursor-pointer" @click="close">
      <Icon name="closeWhite" size="20"></Icon>
    </div>

    <!-- 虛擬列表容器 - 只渲染當前和相鄰的貼文 -->
    <div
      class="relative h-full w-full"
      :style="{ transform: `translateY(${verticalOffset}px)` }"
      :class="{ 'transition-transform duration-300 ease-out': !isVerticalDragging }"
    >
      <div
        v-for="(post, postIndex) in visiblePosts"
        :key="`${post.id}-${postIndex}`"
        class="absolute inset-0 h-full w-full"
        :style="{ transform: `translateY(${getPostTransform(postIndex)}%)` }"
      >
        <!-- 視頻播放器 -->
        <div
          v-if="post.resource_type === MEDIA_TYPE.VIDEO"
          class="relative flex h-full w-full items-center justify-center"
        >
          <Video
            :id="post.id"
            :url="post.url[0]?.url"
            :poster-url="post.url[0]?.url_blur"
            :time="post.time"
            :preview="!post.is_unlock"
            :auto-play="shouldAutoPlay(postIndex)"
            :muted="videoMuted"
            :data-video-id="post.id"
            @play="onVideoPlay(post.id)"
            @pause="onVideoPause(post.id)"
            @ended="onVideoEnded(post.id)"
            @timeupdate="onVideoTimeUpdate"
            class="h-full w-full object-contain"
          />

          <!-- 付費遮罩 - 視頻 -->
          <PaymentOverlay v-if="!post.is_unlock" :post="post" @unlock="handleUnlockClick" />
        </div>

        <!-- 圖片播放器 -->
        <div v-else-if="post.resource_type === MEDIA_TYPE.IMAGE" class="relative h-full w-full overflow-hidden">
          <!-- 圖片容器 -->
          <div
            class="relative h-full w-full"
            :style="{ transform: `translateX(${getImageTransform(postIndex)}px)` }"
            :class="{ 'transition-transform duration-300 ease-out': !isHorizontalDragging }"
          >
            <div
              v-for="(img, imgIndex) in post.url"
              :key="`${post.id}-img-${imgIndex}`"
              class="absolute inset-0 h-full w-full"
              :style="{ transform: `translateX(${(imgIndex - getCurrentImageIndex(postIndex)) * 100}%)` }"
            >
              <div class="flex h-full w-full items-center justify-center">
                <EncryptImage
                  :src="getImageUrl(img, imgIndex, post)"
                  :border-radius="0"
                  :active="shouldLoadImage(postIndex, imgIndex)"
                  cover
                  class="h-full w-full object-contain"
                />
              </div>

              <!-- 付費遮罩 - 圖片 -->
              <PaymentOverlay v-if="isImageLocked(post, imgIndex)" :post="post" @unlock="handleUnlockClick" />
            </div>
          </div>

          <!-- 圖片計數器 -->
          <div
            v-if="post.url.length > 1"
            class="absolute bottom-20 right-20 z-10 flex select-none space-x-5 drop-shadow"
          >
            <Icon name="cameraWhite" size="20"></Icon>
            <span class="text-base text-white">{{ `${getCurrentImageIndex(postIndex) + 1}/${post.url.length}` }}</span>
          </div>
        </div>

        <!-- 貼文信息 -->
        <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-20">
          <div class="flex items-center space-x-10 text-white">
            <Avatar :radius="20" :src="post.user?.thumb" />
            <div>
              <div class="font-bold">{{ post.user?.nickname }}</div>
              <div class="text-sm opacity-80">@{{ post.user?.username }}</div>
            </div>
          </div>
          <div v-if="post.title" class="mt-10 font-bold text-white">{{ post.title }}</div>
          <div v-if="post.content" class="mt-5 line-clamp-3 text-sm text-white opacity-90">
            {{ post.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div
      v-if="showToast"
      class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/80 px-20 py-10 text-white"
    >
      {{ toastMessage }}
    </div>

    <!-- 音量控制提示 -->
    <div
      v-if="showVolumeHint"
      class="absolute left-1/2 top-1/4 z-20 flex -translate-x-1/2 items-center space-x-10 rounded-lg bg-black/80 px-20 py-10 text-white"
    >
      <Icon :name="videoMuted ? 'volumeOff' : 'volumeOn'" size="20"></Icon>
      <span>{{ videoMuted ? '已靜音' : '已開聲' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { usePlayerStore } from '@/store/player'
import EncryptImage from './EncryptImage.vue'
import Icon from '@comp/common/Icon.vue'
import PaymentOverlay from '@comp/multimedia/PaymentOverlay.vue'
import Video from '@comp/multimedia/Video.vue'
import { MEDIA_TYPE } from '@/constant/publish'

// Store
const playerStore = usePlayerStore()
const {
  isOpen,
  posts,
  currentPostIndex,
  currentImageIndex,
  visiblePosts,
  videoMuted,
  isVerticalDragging,
  isHorizontalDragging,
} = storeToRefs(playerStore)

const {
  close,
  goToPrevPost,
  goToNextPost,
  goToPrevImage,
  goToNextImage,
  setVerticalDragging,
  setHorizontalDragging,
  toggleMuted,
  preloadAdjacentPosts,
} = playerStore

const accountStore = useAccountStore()
const { userId, userUUID } = storeToRefs(accountStore)

// 本地存儲進度
const progressStorage = useLocalStorage('vida-player-progress', {})

// 觸摸和拖拽狀態
const playerContainer = ref(null)
const touchStartY = ref(0)
const touchStartX = ref(0)
const verticalOffset = ref(0)
const horizontalOffset = ref(0)
const isDragging = ref(false)
const dragDirection = ref(null) // 'vertical' | 'horizontal'

// Toast 提示
const showToast = ref(false)
const toastMessage = ref('')

// 觸摸事件處理
const onTouchStart = (e) => {
  const touch = e.touches[0]
  touchStartY.value = touch.clientY
  touchStartX.value = touch.clientX
  isDragging.value = false
  dragDirection.value = null
}

const onTouchMove = (e) => {
  e.preventDefault()

  const touch = e.touches[0]
  const deltaY = touch.clientY - touchStartY.value
  const deltaX = touch.clientX - touchStartX.value

  // 確定拖拽方向
  if (!isDragging.value && (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10)) {
    isDragging.value = true

    // 對於視頻，只允許垂直拖拽
    const currentPost = posts.value[currentPostIndex.value]
    if (currentPost?.resource_type === MEDIA_TYPE.VIDEO) {
      dragDirection.value = 'vertical'
    } else {
      // 對於圖片，根據拖拽距離判斷方向
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        dragDirection.value = 'vertical'
      } else {
        dragDirection.value = 'horizontal'
      }
    }
  }

  if (isDragging.value) {
    if (dragDirection.value === 'vertical') {
      verticalOffset.value = deltaY
      setVerticalDragging(true)
    } else if (dragDirection.value === 'horizontal') {
      horizontalOffset.value = deltaX
      setHorizontalDragging(true)
    }
  }
}

const onTouchEnd = () => {
  if (!isDragging.value) return

  const threshold = 100 // 拖拽閾值

  if (dragDirection.value === 'vertical') {
    if (Math.abs(verticalOffset.value) > threshold) {
      if (verticalOffset.value > 0) {
        // 向下拖拽 - 上一個貼文
        goToPrevPost()
      } else {
        // 向上拖拽 - 下一個貼文
        const success = goToNextPost()
        if (!success) {
          showToastMessage('到底了')
        }
      }
    }
    verticalOffset.value = 0
    setVerticalDragging(false)
  } else if (dragDirection.value === 'horizontal') {
    if (Math.abs(horizontalOffset.value) > threshold) {
      if (horizontalOffset.value > 0) {
        // 向右拖拽 - 上一張圖片
        const success = goToPrevImage()
        if (!success) {
          showToastMessage('已是第一張')
        }
      } else {
        // 向左拖拽 - 下一張圖片
        const success = goToNextImage()
        if (!success) {
          showToastMessage('已是最後一張')
        }
      }
    }
    horizontalOffset.value = 0
    setHorizontalDragging(false)
  }

  isDragging.value = false
  dragDirection.value = null
}

// 滾輪事件處理
const onWheel = (e) => {
  e.preventDefault()

  if (e.deltaY > 0) {
    // 向下滾動 - 下一個貼文
    const success = goToNextPost()
    if (!success) {
      showToastMessage('到底了')
    }
  } else {
    // 向上滾動 - 上一個貼文
    goToPrevPost()
  }
}

// 鍵盤事件處理
const onKeyDown = (e) => {
  switch (e.key) {
    case ' ':
      e.preventDefault()
      // 切換播放/暫停
      toggleVideoPlay()
      break
    case 'ArrowUp':
      e.preventDefault()
      goToPrevPost()
      break
    case 'ArrowDown':
      e.preventDefault()
      if (!goToNextPost()) {
        showToastMessage('到底了')
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (!goToPrevImage()) {
        showToastMessage('已是第一張')
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (!goToNextImage()) {
        showToastMessage('已是最後一張')
      }
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
  }
}

// 視頻播放控制
const toggleVideoPlay = () => {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost?.resource_type === MEDIA_TYPE.VIDEO) {
    const videoElement = document.querySelector(`[data-video-id="${currentPost.id}"]`)
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play()
      } else {
        videoElement.pause()
      }
    }
  }
}

const onVideoClick = () => {
  // 點擊視頻切換靜音狀態
  toggleMuted()
}

// 視頻事件處理
const onVideoPlay = (videoId) => {
  console.log('Video playing:', videoId)
}

const onVideoPause = (videoId) => {
  console.log('Video paused:', videoId)
}

const onVideoEnded = (videoId) => {
  console.log('Video ended:', videoId)
  // 自動播放下一個
  const success = goToNextPost()
  if (!success) {
    showToastMessage('到底了')
  }
}

const onVideoTimeUpdate = (time) => {
  // 每5秒保存一次進度
  if (Math.floor(time) % 5 === 0) {
    saveProgress(time)
  }
}

// 輔助函數
const getPostTransform = (postIndex) => {
  return (postIndex - 1) * 100 // 相對於中間位置的偏移
}

const getImageTransform = (postIndex) => {
  if (postIndex === 1) {
    // 當前貼文
    return horizontalOffset.value
  }
  return 0
}

const getCurrentImageIndex = (postIndex) => {
  if (postIndex === 1) {
    // 當前貼文
    return currentImageIndex.value
  }
  return 0
}

const shouldAutoPlay = (postIndex) => {
  return postIndex === 1 // 只有當前貼文自動播放
}

const shouldLoadImage = (postIndex, imgIndex) => {
  // 當前貼文的當前圖片和相鄰圖片需要載入
  if (postIndex === 1) {
    const currentImg = getCurrentImageIndex(postIndex)
    return Math.abs(imgIndex - currentImg) <= 1
  }
  return false
}

// 進度管理
const saveProgress = (currentTime = 0) => {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost && (userId.value || userUUID.value)) {
    const key = `${userId.value || userUUID.value}_${currentPost.id}`
    progressStorage.value[key] = {
      postId: currentPost.id,
      imageIndex: currentImageIndex.value,
      videoTime: currentTime,
      timestamp: Date.now(),
    }
  }
}

const loadProgress = () => {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost) {
    const key = `${userId.value || userUUID.value}_${currentPost.id}`
    return progressStorage.value[key]
  }
  return null
}

// Toast 提示
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 付費解鎖處理
const handleUnlockClick = async (post) => {
  // 實現付費解鎖邏輯
  console.log('Handle unlock for post:', post.id)
}

// 圖片相關輔助函數
const getImageUrl = (img, imgIndex, post) => {
  return img.url
}

const isImageLocked = (post, imgIndex) => {
  return !post.is_unlock
}

// 監聽播放器開關
watch(isOpen, (newValue) => {
  if (newValue) {
    // 播放器打開時聚焦以接收鍵盤事件
    nextTick(() => {
      playerContainer.value?.focus()
    })

    // 載入進度
    const progress = loadProgress()
    if (progress) {
      playerStore.setCurrentImage(progress.imageIndex || 0)
    }
  }
})

// 監聽當前貼文變化
watch(currentPostIndex, () => {
  // 重置圖片索引
  playerStore.setCurrentImage(0)

  // 載入進度
  const progress = loadProgress()
  if (progress) {
    playerStore.setCurrentImage(progress.imageIndex || 0)
  }

  // 預載相鄰貼文
  preloadAdjacentPosts()
})

// 組件掛載時聚焦
onMounted(() => {
  if (isOpen.value) {
    nextTick(() => {
      playerContainer.value?.focus()
    })
  }
})

// 防止 iOS 回彈
onMounted(() => {
  const preventDefault = (e) => e.preventDefault()
  document.addEventListener('touchmove', preventDefault, { passive: false })

  onUnmounted(() => {
    document.removeEventListener('touchmove', preventDefault)
  })
})
</script>

<style scoped>
/* 確保播放器容器可以接收鍵盤事件 */
.fixed {
  outline: none;
}

/* iOS 滾動優化 */
@supports (-webkit-overflow-scrolling: touch) {
  .overflow-hidden {
    -webkit-overflow-scrolling: touch;
  }
}

/* 防止文字選擇 */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
