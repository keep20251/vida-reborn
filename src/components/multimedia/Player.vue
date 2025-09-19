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
            :data-video-id="post.id"
            @play="onVideoPlay"
            @ended="onVideoEnded"
            @timeupdate="onVideoTimeUpdate"
          />
          
          <!-- 付費遮罩 - 視頻 -->
          <div
            v-if="!post.is_unlock"
            class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            @click="handleUnlockClick(post)"
          >
            <div class="text-center text-white">
              <Icon name="lock" size="48" class="mx-auto mb-4 opacity-80" />
              <div class="text-xl font-bold mb-2">Subscribe to Unlock</div>
              <div class="text-lg mb-4">解鎖觀看</div>
              <div class="px-6 py-3 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                點擊訂閱
              </div>
            </div>
          </div>
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
              
              <!-- 付費遮罩 - 圖片 -->
              <div
                v-if="isImageLocked(post, imgIndex)"
                class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                @click="handleUnlockClick(post)"
              >
                <div class="text-center text-white">
                  <Icon name="lock" size="48" class="mx-auto mb-4 opacity-80" />
                  <div class="text-xl font-bold mb-2">Subscribe to Unlock</div>
                  <div class="text-lg mb-4">解鎖觀看</div>
                  <div class="px-6 py-3 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    點擊訂閱
                  </div>
                </div>
              </div>
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
import { useAccountStore } from '@/store/account'
import { usePaymentStore } from '@/store/payment'
import { useSubsciptionStore } from '@/store/subscription'
import { useFeedStore } from '@/store/feed'
import { useEventListener, useLocalStorage } from '@vueuse/core'
import Video from './Video.vue'
import Avatar from './Avatar.vue'
import LockInfo from './LockInfo.vue'
import EncryptImage from './EncryptImage.vue'
import Icon from '@comp/common/Icon.vue'
import { MEDIA_TYPE } from '@const/publish'
import { isIOS } from '@/utils/device'

const appStore = useAppStore()
const { isMobile } = storeToRefs(appStore)

const playerStore = usePlayerStore()
const { isOpen, posts, currentPostIndex, currentImageIndex } = storeToRefs(playerStore)
const { close, setCurrentPost, setCurrentImage, loadMorePosts } = playerStore

const accountStore = useAccountStore()
const { userId, userUUID } = storeToRefs(accountStore)

const paymentStore = usePaymentStore()
const { open: openPayment } = paymentStore

const subscriptionStore = useSubsciptionStore()
const { openDetailFromCreator } = subscriptionStore

const feedStore = useFeedStore()
const { unlockFeed, unlockSubscribe } = feedStore

// 付費遮罩處理
const handleUnlockClick = async (post) => {
  try {
    // 如果有訂閱方案，打開訂閱對話框
    if (post.subscription_list && post.subscription_list.length > 0) {
      const creator = {
        id: post.user?.id,
        nickname: post.user?.nickname,
        username: post.user?.username,
        subscription_list: post.subscription_list
      }
      
      // 選擇最便宜的訂閱方案作為預設
      const activeSubscription = post.subscription_list.reduce((acc, cur) => 
        Number(acc.price) < Number(cur.price) ? acc : cur
      )
      
      openDetailFromCreator({
        activeSubscription,
        subscriptions: post.subscription_list,
        creator
      })
    } else {
      // 直接購買單篇內容
      openPayment({
        amount: post.price || 0,
        paymentConfig: {
          type: 'single_post',
          postId: post.id,
          data: {
            amount: post.price || 0,
            post_id: post.id
          }
        }
      })
    }
  } catch (error) {
    console.error('處理解鎖點擊時發生錯誤:', error)
    showToastMessage('處理付費時發生錯誤，請稍後再試')
  }
}

// 監聽付費成功事件
const handlePaymentSuccess = async (paymentResult) => {
  try {
    const currentPost = posts.value[currentPostIndex.value]
    if (!currentPost) return
    
    if (paymentResult.type === 'subscription') {
      // 訂閱成功，解鎖所有相關內容
      await unlockSubscribe(paymentResult.subscriptionId)
      showToastMessage('訂閱成功！內容已解鎖')
    } else if (paymentResult.type === 'single_post') {
      // 單篇購買成功
      await unlockFeed(currentPost.id)
      showToastMessage('購買成功！內容已解鎖')
    }
    
    // 繼續播放
    if (currentPost.resource_type === MEDIA_TYPE.VIDEO) {
      const videoElement = document.querySelector(`[data-video-id="${currentPost.id}"] video`)
      if (videoElement) {
        videoElement.play()
      }
    }
  } catch (error) {
    console.error('處理付費成功時發生錯誤:', error)
    showToastMessage('解鎖內容時發生錯誤')
  }
}

// Toast 提示功能
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

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

// iOS 手勢衝突處理
const isIOSDevice = isIOS()
const touchStartPosition = ref({ x: 0, y: 0 })
const isVerticalScroll = ref(false)
const isHorizontalScroll = ref(false)

// 觸摸開始
function onTouchStart(event) {
  const touch = event.touches[0]
  startY.value = touch.clientY
  startX.value = touch.clientX
  lastY.value = touch.clientY
  lastX.value = touch.clientX
  isDragging.value = false
  isHorizontalDragging.value = false
  
  // iOS 手勢處理：記錄初始位置
  if (isIOSDevice) {
    touchStartPosition.value = { x: touch.clientX, y: touch.clientY }
    isVerticalScroll.value = false
    isHorizontalScroll.value = false
  }
}

// 觸摸移動
function onTouchMove(event) {
  const touch = event.touches[0]
  const deltaY = touch.clientY - lastY.value
  const deltaX = touch.clientX - lastX.value
  const totalDeltaY = touch.clientY - startY.value
  const totalDeltaX = touch.clientX - startX.value

  // iOS 手勢衝突處理
  if (isIOSDevice) {
    const currentDeltaY = touch.clientY - touchStartPosition.value.y
    const currentDeltaX = touch.clientX - touchStartPosition.value.x
    
    // 判斷滑動方向並決定是否阻止默認行為
    if (!isVerticalScroll.value && !isHorizontalScroll.value) {
      if (Math.abs(currentDeltaY) > Math.abs(currentDeltaX) && Math.abs(currentDeltaY) > 10) {
        isVerticalScroll.value = true
        // 垂直滑動時阻止iOS回彈
        event.preventDefault()
      } else if (Math.abs(currentDeltaX) > Math.abs(currentDeltaY) && Math.abs(currentDeltaX) > 10) {
        const currentPost = posts.value[currentPostIndex.value]
        if (currentPost?.resource_type === MEDIA_TYPE.IMAGE && currentPost.url.length > 1) {
          isHorizontalScroll.value = true
          // 水平滑動時阻止iOS回彈
          event.preventDefault()
        }
      }
    } else {
      // 已確定滑動方向，持續阻止默認行為
      event.preventDefault()
    }
  } else {
    // 非iOS設備，正常阻止默認行為
    event.preventDefault()
  }

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

// 進度記憶功能
const progressStorage = useLocalStorage('player-progress', {})
const progressSaveInterval = ref(null)

// 保存播放進度
function saveProgress(contentId, currentTime, duration) {
  const clientId = userUUID.value || userId.value || 'guest'
  const progressKey = `${clientId}_${contentId}`
  
  progressStorage.value[progressKey] = {
    client_id: clientId,
    content_id: contentId,
    current_time: currentTime,
    duration: duration,
    timestamp: Date.now()
  }
}

// 獲取播放進度
function getProgress(contentId) {
  const clientId = userUUID.value || userId.value || 'guest'
  const progressKey = `${clientId}_${contentId}`
  
  const progress = progressStorage.value[progressKey]
  if (progress && progress.current_time > 0) {
    return progress.current_time
  }
  return 0
}

// 清理過期進度記錄（超過 30 天）
function cleanupOldProgress() {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  
  Object.keys(progressStorage.value).forEach(key => {
    const progress = progressStorage.value[key]
    if (progress.timestamp < thirtyDaysAgo) {
      delete progressStorage.value[key]
    }
  })
}

// 開始進度保存定時器
function startProgressSaving() {
  if (progressSaveInterval.value) {
    clearInterval(progressSaveInterval.value)
  }
  
  progressSaveInterval.value = setInterval(() => {
    const currentPost = posts.value[currentPostIndex.value]
    if (currentPost?.resource_type === MEDIA_TYPE.VIDEO) {
      const videoElement = document.querySelector(`[data-video-id="${currentPost.id}"] video`)
      if (videoElement && !videoElement.paused) {
        saveProgress(currentPost.id, videoElement.currentTime, videoElement.duration)
      }
    }
  }, 5000) // 每 5 秒保存一次
}

// 停止進度保存定時器
function stopProgressSaving() {
  if (progressSaveInterval.value) {
    clearInterval(progressSaveInterval.value)
    progressSaveInterval.value = null
  }
}

// 恢復播放進度
function restoreProgress(contentId) {
  const savedTime = getProgress(contentId)
  if (savedTime > 0) {
    nextTick(() => {
      const videoElement = document.querySelector(`[data-video-id="${contentId}"] video`)
      if (videoElement) {
        videoElement.currentTime = savedTime
      }
    })
  }
}

// 鍵盤和滑鼠控制
const videoRef = ref(null)

// 鍵盤事件處理
useEventListener('keydown', (event) => {
  if (!isOpen.value) return
  
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      handleSpaceKey()
      break
    case 'ArrowUp':
      event.preventDefault()
      handleArrowUp()
      break
    case 'ArrowDown':
      event.preventDefault()
      handleArrowDown()
      break
    case 'ArrowLeft':
      event.preventDefault()
      handleArrowLeft()
      break
    case 'ArrowRight':
      event.preventDefault()
      handleArrowRight()
      break
  }
})

// 滑鼠滾輪事件處理
useEventListener('wheel', (event) => {
  if (!isOpen.value) return
  
  event.preventDefault()
  
  if (event.deltaY > 0) {
    // 向下滾動 - 下一個貼文
    handleArrowDown()
  } else {
    // 向上滾動 - 上一個貼文
    handleArrowUp()
  }
}, { passive: false })

// Space 鍵處理 - 暫停/播放
function handleSpaceKey() {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost?.resource_type === MEDIA_TYPE.VIDEO) {
    // 觸發視頻播放/暫停
    const videoComponent = document.querySelector(`[data-video-id="${currentPost.id}"]`)
    if (videoComponent) {
      const video = videoComponent.querySelector('video')
      if (video) {
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      }
    }
  }
}

// 上箭頭處理 - 上一個貼文
async function handleArrowUp() {
  if (currentPostIndex.value > 0) {
    setCurrentPost(currentPostIndex.value - 1)
    resetCurrentImage()
  } else {
    showToastMessage('已經是第一個了')
  }
}

// 下箭頭處理 - 下一個貼文
async function handleArrowDown() {
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

// 左箭頭處理 - 上一張圖片
function handleArrowLeft() {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost?.resource_type === MEDIA_TYPE.IMAGE && currentPost.url.length > 1) {
    if (currentImageIndex.value > 0) {
      setCurrentImage(currentImageIndex.value - 1)
    }
  }
}

// 右箭頭處理 - 下一張圖片
function handleArrowRight() {
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost?.resource_type === MEDIA_TYPE.IMAGE && currentPost.url.length > 1) {
    if (currentImageIndex.value < currentPost.url.length - 1) {
      setCurrentImage(currentImageIndex.value + 1)
    }
  }
}

// 視頻播放事件
function onVideoPlay() {
  // 視頻開始播放，開始進度保存
  startProgressSaving()
}

function onVideoEnded() {
  // 視頻播放結束，清除進度記錄
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost) {
    const clientId = userUUID.value || userId.value || 'guest'
    const progressKey = `${clientId}_${currentPost.id}`
    delete progressStorage.value[progressKey]
  }
  
  // 自動切換到下一個貼文
  if (currentPostIndex.value < posts.value.length - 1) {
    setCurrentPost(currentPostIndex.value + 1)
    resetCurrentImage()
  }
}

function onVideoTimeUpdate(currentTime) {
  // 視頻時間更新
}

// 監聽當前貼文變化，重置偏移量並恢復進度
watch(currentPostIndex, () => {
  verticalOffset.value = 0
  horizontalOffset.value = 0
  
  // 恢復視頻播放進度
  const currentPost = posts.value[currentPostIndex.value]
  if (currentPost?.resource_type === MEDIA_TYPE.VIDEO) {
    restoreProgress(currentPost.id)
  }
})

// 監聽當前圖片變化，重置水平偏移量
watch(currentImageIndex, () => {
  horizontalOffset.value = 0
})

// 監聽播放器開關狀態
watch(isOpen, (open) => {
  if (open) {
    // 播放器打開時清理過期進度並開始進度保存
    cleanupOldProgress()
    startProgressSaving()
  } else {
    // 播放器關閉時停止進度保存
    stopProgressSaving()
  }
})

// 組件卸載時清理定時器
onBeforeUnmount(() => {
  stopProgressSaving()
})
</script>

<style scoped>
.fixed {
  /* 防止 iOS Safari 回彈效果 */
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  
  /* 防止 iOS 雙擊縮放 */
  touch-action: manipulation;
  
  /* 防止選擇文字 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 針對 iOS 設備的額外優化 */
@supports (-webkit-touch-callout: none) {
  .fixed {
    /* 禁用 iOS 長按菜單 */
    -webkit-touch-callout: none;
    
    /* 防止 iOS 回彈 */
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    
    /* 確保觸摸事件正確處理 */
    touch-action: pan-x pan-y;
  }
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 1000;
  font-size: 16px;
  white-space: nowrap;
}

.post-info {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>