<template>
  <div class="recommended-creators-card">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">{{ $t('title.recommendedCreators') }}</h3>
    </div>
    
    <!-- 推薦已關注博主的新品 -->
    <div v-if="followedCreatorsNewPosts.length > 0" class="mb-6">
      <h4 class="text-base font-semibold mb-3">{{ $t('title.newPostsFromFollowed') }}</h4>
      <div class="space-y-3">
        <div 
          v-for="post in followedCreatorsNewPosts" 
          :key="post.id"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          @click="goToPost(post)"
        >
          <img 
            :src="post.creator.avatar || '/default-avatar.png'" 
            :alt="post.creator.nickname"
            class="w-10 h-10 rounded-full object-cover"
          >
          <div class="flex-1">
            <p class="text-sm font-medium">{{ post.creator.nickname }}</p>
            <p class="text-xs text-gray-600 truncate">{{ post.title }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
          </div>
          <div class="text-xs text-blue-600">{{ $t('label.new') }}</div>
        </div>
      </div>
    </div>

    <!-- 推薦最近搜索博主的熱賣作品 -->
    <div v-if="searchedCreatorsHotPosts.length > 0">
      <h4 class="text-base font-semibold mb-3">{{ $t('title.hotPostsFromSearched') }}</h4>
      <div class="space-y-3">
        <div 
          v-for="post in searchedCreatorsHotPosts" 
          :key="post.id"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          @click="goToPost(post)"
        >
          <img 
            :src="post.creator.avatar || '/default-avatar.png'" 
            :alt="post.creator.nickname"
            class="w-10 h-10 rounded-full object-cover"
          >
          <div class="flex-1">
            <p class="text-sm font-medium">{{ post.creator.nickname }}</p>
            <p class="text-xs text-gray-600 truncate">{{ post.title }}</p>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-500">{{ $t('label.views') }}: {{ post.view_count }}</span>
              <span class="text-xs text-gray-500">{{ $t('label.likes') }}: {{ post.like_count }}</span>
            </div>
          </div>
          <div class="text-xs text-red-600">{{ $t('label.hot') }}</div>
        </div>
      </div>
    </div>

    <!-- 無推薦內容時的提示 -->
    <div v-if="followedCreatorsNewPosts.length === 0 && searchedCreatorsHotPosts.length === 0" class="text-center py-8">
      <p class="text-gray-500">{{ $t('message.noRecommendations') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useSearchStore } from '@/store/search'
import { useRouters } from '@/compositions/routers'
import useRequest from '@use/request'

const { to } = useRouters()

const accountStore = useAccountStore()
const { isLogin } = storeToRefs(accountStore)

const searchStore = useSearchStore()
const { historyTags } = storeToRefs(searchStore)

const followedCreatorsNewPosts = ref([])
const searchedCreatorsHotPosts = ref([])

// 獲取已關注博主的新品
const fetchFollowedCreatorsNewPosts = async () => {
  if (!isLogin.value) return

  try {
    // 獲取訂閱列表
    const subscriptions = await useRequest('User.listSubs', { immediate: true })
    if (!subscriptions || subscriptions.length === 0) return

    // 獲取這些創作者的最新帖子
    const creatorUuids = subscriptions.map(sub => sub.creator_uuid)
    const posts = []
    
    for (const uuid of creatorUuids.slice(0, 5)) { // 限制最多5個創作者
      try {
        const creatorPosts = await useRequest('Article.listByUser', {
          params: { 
            uuid,
            page: 1,
            limit: 2 // 每個創作者最多2篇最新帖子
          },
          immediate: true
        })
        
        if (creatorPosts?.list) {
          posts.push(...creatorPosts.list.slice(0, 2))
        }
      } catch (error) {
        console.error(`獲取創作者 ${uuid} 帖子失敗:`, error)
      }
    }

    // 按創建時間排序，取最新的5篇
    followedCreatorsNewPosts.value = posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      
  } catch (error) {
    console.error('獲取已關注博主新品失敗:', error)
  }
}

// 獲取最近搜索博主的熱賣作品
const fetchSearchedCreatorsHotPosts = async () => {
  if (!isLogin.value || !historyTags.value || historyTags.value.length === 0) return

  try {
    const posts = []
    
    // 取最近搜索的關鍵詞（最多3個）
    const recentSearches = historyTags.value.slice(-3)
    
    for (const search of recentSearches) {
      try {
        // 先搜索創作者
        const creators = await useRequest('User.searchCreator', {
          params: { 
            keyword: search.value,
            page: 1,
            limit: 2
          },
          immediate: true
        })
        
        if (creators?.list) {
          // 獲取這些創作者的熱門帖子
          for (const creator of creators.list) {
            try {
              const creatorPosts = await useRequest('Article.listByUser', {
                params: { 
                  uuid: creator.uuid,
                  page: 1,
                  limit: 2,
                  sort: 'popular' // 按熱度排序
                },
                immediate: true
              })
              
              if (creatorPosts?.list) {
                posts.push(...creatorPosts.list.slice(0, 2))
              }
            } catch (error) {
              console.error(`獲取創作者 ${creator.uuid} 熱門帖子失敗:`, error)
            }
          }
        }
      } catch (error) {
        console.error(`搜索創作者 ${search.value} 失敗:`, error)
      }
    }

    // 按熱度排序（點讚數 + 觀看數），取前5篇
    searchedCreatorsHotPosts.value = posts
      .sort((a, b) => (b.like_count + b.view_count) - (a.like_count + a.view_count))
      .slice(0, 5)
      
  } catch (error) {
    console.error('獲取搜索博主熱賣作品失敗:', error)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1天前'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)}週前`
  return `${Math.ceil(diffDays / 30)}月前`
}

// 跳轉到帖子詳情
const goToPost = (post) => {
  to('feed', { params: { id: post.id } })
}

// 載入推薦內容
const loadRecommendations = async () => {
  await Promise.all([
    fetchFollowedCreatorsNewPosts(),
    fetchSearchedCreatorsHotPosts()
  ])
}

onMounted(() => {
  if (isLogin.value) {
    loadRecommendations()
  }
})

// 監聽登錄狀態變化
watch(isLogin, (newVal) => {
  if (newVal) {
    loadRecommendations()
  } else {
    followedCreatorsNewPosts.value = []
    searchedCreatorsHotPosts.value = []
  }
})
</script>

<style scoped>
.recommended-creators-card {
  @apply bg-white rounded-lg p-4 shadow-sm;
}
</style>