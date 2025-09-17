<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black"
    ref="playerContainer"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 關閉按鈕 -->
    <div class="absolute right-20 top-20 z-10 cursor-pointer" @click="close">
      <Icon name="closeWhite" size="20"></Icon>
    </div>

    <!-- 貼文列表容器 -->
    <div
      class="h-full w-full"
      :style="{ transform: `translateY(${verticalOffset}px)` }"
      :class="{ 'transition-transform duration-300 ease-out': !isDragging }"
    >
      <div
        v-for="(post, postIndex) in posts"
        :key="post.id"
        class="absolute inset-0 h-full w-full"
        :style="{ transform: `translateY(${(postIndex - currentPostIndex) * 100}%)` }"
      >
        <!-- 視頻播放器 -->
        <div
          v-if="post.resource_type === MEDIA_TYPE.VIDEO"
          class="relative h-full w-full"
          :style="{ transform: `translateX(${horizontalOffset}px)` }"
          :class="{ 'transition-transform duration-300 ease-out': !isHorizontalDragging }"
        >
          <Video
            :id="post.id"
            :url="post.url[0]?.url"
            :poster-url="post.url[0]?.url_blur"
            :time="post.time"
            :preview="!post.is_unlock"
            @play="onVideoPlay"
            @ended="onVideoEnded"
            @timeupdate="onVideoTimeUpdate"
          />
        </div>

        <!-- 圖片播放器 -->
        <div
          v-else-if="post.resource_type === MEDIA_TYPE.IMAGE"
          class="relative h-full w-full overflow-hidden"
        >
          <div
            class="h-full w-full"
            :style="{ transform: `translateX(${horizontalOffset}px)` }"
            :class="{ 'transition-transform duration-300 ease-out': !isHorizontalDragging }"
          >
            <div
              v-for="(img, imgIndex) in post.url"
              :key="imgIndex"
              class="absolute inset-0 h-full w-full"
              :style="{ transform: `translateX(${(imgIndex - currentImageIndex) * 100}%)` }"
            >
              <div class="flex h-full w-full items-center justify-center">
                <EncryptImage
                  :src="getImageUrl(img, imgIndex, post)"
                  :border-radius="0"
                  :active="Math.abs(imgIndex - currentImageIndex) <= 1"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
              <LockInfo v-if="isImageLocked(post, imgIndex)" :item="post" />
            </div>
          </div>

          <!-- 圖片計數器 -->
          <div
            v-if="post.url.length > 1"
            class="absolute bottom-20 right-20 flex select-none space-x-5 drop-shadow"
          >
            <Icon name="cameraWhite" size="20"></Icon>
            <span class="text-base text-white">{{ `${currentImageIndex + 1}/${post.url.length}` }}</span>
          </div>
        </div>

        <!-- 貼文信息 -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-20">
          <div class="flex items-center space-x-10 text-white">
            <Avatar :radius="20" :src="post.user?.thumb" />
            <div>
              <div class="font-bold">{{ post.user?.nickname }}</div>
              <div class="text-sm opacity-80">@{{ post.user?.username }}</div>
            </div>
          </div>
          <div v-if="post.title" class="mt-10 text-white font-bold">{{ post.title }}</div>
          <div v-if="post.content" class="mt-5 text-white text-sm opacity-90 line-clamp-3">
            {{ post.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div
      v-if="showToast"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/80 px-20 py-10 text-white"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import Video from './Video.vue'
import Avatar from './Avatar.vue'
import LockInfo from './LockInfo.vue'
import EncryptImage from './EncryptImage.vue'
import Icon from '@comp/common/Icon.vue'
import { MEDIA_TYPE } from '@const/publish'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const playerStore = usePlayerStore()
const { isOpen, posts, currentPostIndex, currentImageIndex } = storeToRefs(playerStore)
const { close, setCurrentPost, setCurrentImage, loadMorePosts } = playerStore

// 觸摸手勢相關
const playerContainer = ref(null)
const isDragging = ref(false)
const isHorizontalDragging = ref(false)
const verticalOffset = ref(0)
const horizontalOffset = ref(0)
const startY = ref(0)
const startX = ref(0)
const lastY = ref(0)
const lastX = ref(0)

// Toast 提示
const showToast = ref(false)
const toastMessage = ref('')

// 觸摸開始
function onTouchStart(event) {
  const touch = event.touches[0]
  startY.value = touch.clientY
  startX.value = touch.clientX
  lastY.value = touch.clientY
  lastX.value = touch.clientX
  isDragging.value = false
  isHorizontalDragging.value = false
}

// 觸摸移動
function onTouchMove(event) {
  event.preventDefault()
  const touch = event.touches[0]
  const deltaY = touch.clientY - lastY.value
  const deltaX = touch.clientX - lastX.value
  const totalDeltaY = touch.clientY - startY.value
  const totalDeltaX = touch.clientX - startX.value

  // 判斷滑動方向
  if (!isDragging.value && !isHorizontalDragging.value) {
    if (Math.abs(totalDeltaY) > Math.abs(totalDeltaX) && Math.abs(totalDeltaY) > 10) {
      isDragging.value = true
    } else if (Math.abs(totalDeltaX) > Math.abs(totalDeltaY) && Math.abs(totalDeltaX) > 10) {
      const currentPost = posts.value[currentPostIndex.value]
      if (currentPost?.resource_type === MEDIA_TYPE.IMAGE && currentPost.url.length > 1) {
        isHorizontalDragging.value = true
      }
    }
  }

  // 垂直滑動 - 切換貼文
  if (isDragging.value) {
    verticalOffset.value += deltaY
  }

  // 水平滑動 - 切換圖片
  if (isHorizontalDragging.value) {
    horizontalOffset.value += deltaX
  }

  lastY.value = touch.clientY
  lastX.value = touch.clientX
}

// 觸摸結束
async function  onTouchEnd(event) {
  const totalDeltaY = lastY.value - startY.value
  const totalDeltaX = lastX.value - startX.value

  if (isDragging.value) {
    // 垂直滑動結束處理
    const threshold = window.innerHeight * 0.3
    
    if (Math.abs(verticalOffset.value) > threshold) {
      if (verticalOffset.value > 0) {
        // 向下滑動 - 上一個貼文
        if (currentPostIndex.value > 0) {
          setCurrentPost(currentPostIndex.value - 1)
          resetCurrentImage()
        } else {
          showToastMessage('已經是第一個了')
        }
      } else {
        // 向上滑動 - 下一個貼文
        if (currentPostIndex.value < posts.value.length - 1) {
          setCurrentPost(currentPostIndex.value + 1)
          resetCurrentImage()
        } else {
          // 嘗試載入更多同一創作者的貼文
          const currentPost = posts.value[currentPostIndex.value]
          if (currentPost?.user?.id) {
            await loadMorePosts(currentPost.user.id)
            if (currentPostIndex.value < posts.value.length - 1) {
              setCurrentPost(currentPostIndex.value + 1)
              resetCurrentImage()
            } else {
              showToastMessage('到底了')
            }
          } else {
            showToastMessage('到底了')
          }
        }
      }
    }
    
    verticalOffset.value = 0
    isDragging.value = false
  }

  if (isHorizontalDragging.value) {
    // 水平滑動結束處理
    const threshold = window.innerWidth * 0.3
    const currentPost = posts.value[currentPostIndex.value]
    
    if (Math.abs(horizontalOffset.value) > threshold && currentPost) {
      if (horizontalOffset.value > 0) {
        // 向右滑動 - 上一張圖片
        if (currentImageIndex.value > 0) {
          setCurrentImage(currentImageIndex.value - 1)
        }
      } else {
        // 向左滑動 - 下一張圖片
        if (currentImageIndex.value < currentPost.url.length - 1) {
          setCurrentImage(currentImageIndex.value + 1)
        }
      }
    }
    
    horizontalOffset.value = 0
    isHorizontalDragging.value = false
  }
}

// 重置當前圖片索引
function resetCurrentImage() {
  setCurrentImage(0)
}

// 顯示 Toast 提示
function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 獲取圖片 URL
function getImageUrl(img, index, post) {
  if (!post.is_unlock && (post.url.length === 1 || index > 0)) {
    return img.url_blur
  }
  return img.url
}

// 判斷圖片是否被鎖定
function isImageLocked(post, index) {
  return !post.is_unlock && (post.url.length === 1 || index > 0)
}

// 視頻播放事件
function onVideoPlay() {
  // 視頻開始播放
}

function onVideoEnded() {
  // 視頻播放結束，自動切換到下一個貼文
  if (currentPostIndex.value < posts.value.length - 1) {
    setCurrentPost(currentPostIndex.value + 1)
    resetCurrentImage()
  }
}

function onVideoTimeUpdate(currentTime) {
  // 視頻時間更新
}

// 監聽當前貼文變化，重置偏移量
watch(currentPostIndex, () => {
  verticalOffset.value = 0
  horizontalOffset.value = 0
})

// 監聽當前圖片變化，重置水平偏移量
watch(currentImageIndex, () => {
  horizontalOffset.value = 0
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>