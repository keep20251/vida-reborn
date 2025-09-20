<template>
  <div class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
    <!-- 解鎖提示卡片 -->
    <div class="bg-white rounded-2xl p-30 mx-20 max-w-sm text-center shadow-2xl">
      <!-- 鎖定圖標 -->
      <div class="flex justify-center mb-20">
        <div class="w-60 h-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Icon name="lock" size="30" class="text-white" />
        </div>
      </div>
      
      <!-- 標題 -->
      <h3 class="text-xl font-bold text-gray-900 mb-10">
        {{ $t('player.unlockTitle') }}
      </h3>
      
      <!-- 描述 -->
      <p class="text-gray-600 mb-20 text-sm leading-relaxed">
        {{ $t('player.unlockDescription') }}
      </p>
      
      <!-- 創作者信息 -->
      <div class="flex items-center justify-center space-x-10 mb-20 p-15 bg-gray-50 rounded-xl">
        <Avatar :radius="20" :src="post.user?.thumb" />
        <div class="text-left">
          <div class="font-semibold text-gray-900 text-sm">{{ post.user?.nickname }}</div>
          <div class="text-gray-500 text-xs">@{{ post.user?.username }}</div>
        </div>
      </div>
      
      <!-- 解鎖按鈕 -->
      <button
        @click="handleUnlock"
        :disabled="isUnlocking"
        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-15 px-20 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-10"
      >
        <Icon v-if="isUnlocking" name="loading" size="16" class="animate-spin" />
        <span>{{ isUnlocking ? $t('player.unlocking') : $t('player.unlockButton') }}</span>
      </button>
      
      <!-- 訂閱信息 -->
      <div class="mt-15 text-xs text-gray-500">
        {{ $t('player.subscriptionHint') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/store/payment'
import { useSubsciptionStore } from '@/store/subscription'
import { useAccountStore } from '@/store/account'
import Avatar from './Avatar.vue'
import Icon from '@comp/common/Icon.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['unlock'])

const router = useRouter()
const paymentStore = usePaymentStore()
const subscriptionStore = useSubsciptionStore()
const accountStore = useAccountStore()

const isUnlocking = ref(false)

const handleUnlock = async () => {
  if (isUnlocking.value) return
  
  try {
    isUnlocking.value = true
    
    // 檢查用戶是否已登入
    if (!accountStore.isLogin) {
      // 跳轉到登入頁面
      router.push('/login')
      return
    }
    
    // 檢查是否已有有效訂閱
    const hasValidSubscription = await subscriptionStore.checkSubscriptionStatus()
    
    if (hasValidSubscription) {
      // 已有訂閱，直接解鎖
      await unlockContent()
    } else {
      // 沒有訂閱，跳轉到訂閱頁面
      router.push(`/subscribe?creator=${props.post.user?.id}&return=player`)
    }
  } catch (error) {
    console.error('解鎖失敗:', error)
    // 顯示錯誤提示
  } finally {
    isUnlocking.value = false
  }
}

const unlockContent = async () => {
  try {
    // 調用解鎖 API
    const result = await paymentStore.unlockContent({
      contentId: props.post.id,
      contentType: props.post.resource_type,
      creatorId: props.post.user?.id
    })
    
    if (result.success) {
      // 解鎖成功，更新貼文狀態
      // props.post.is_unlock = true
      
      // 通知父組件
      emit('unlock', props.post)
      
      // 顯示成功提示
      showSuccessMessage()
    } else {
      throw new Error(result.message || '解鎖失敗')
    }
  } catch (error) {
    console.error('解鎖內容失敗:', error)
    throw error
  }
}

const showSuccessMessage = () => {
  // 可以使用 toast 或其他方式顯示成功消息
  console.log('內容解鎖成功！')
}
</script>

<style scoped>
/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-white {
  animation: fadeIn 0.3s ease-out;
}

/* 按鈕懸停效果 */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 載入動畫 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>