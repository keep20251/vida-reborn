import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import useRequest from '@use/request'

export const usePlayerStore = defineStore('player', () => {
  // 播放器狀態
  const isOpen = ref(false)
  const posts = ref([])
  const currentPostIndex = ref(0)
  const currentImageIndex = ref(0)
  
  // 當前貼文
  const currentPost = computed(() => posts.value[currentPostIndex.value])
  
  // 當前創作者的所有貼文
  const currentCreatorPosts = computed(() => {
    if (!currentPost.value) return []
    return posts.value.filter(post => post.user?.id === currentPost.value.user?.id)
  })

  // 打開播放器
  function open(postList, initialPostIndex = 0, initialImageIndex = 0) {
    posts.value = postList
    currentPostIndex.value = initialPostIndex
    currentImageIndex.value = initialImageIndex
    isOpen.value = true
    
    // 預載相鄰貼文
    preloadAdjacentPosts()
  }

  // 關閉播放器
  function close() {
    isOpen.value = false
    posts.value = []
    currentPostIndex.value = 0
    currentImageIndex.value = 0
  }

  // 設置當前貼文索引
  function setCurrentPost(index) {
    if (index >= 0 && index < posts.value.length) {
      currentPostIndex.value = index
      preloadAdjacentPosts()
    }
  }

  // 設置當前圖片索引
  function setCurrentImage(index) {
    const post = currentPost.value
    if (post && index >= 0 && index < post.url.length) {
      currentImageIndex.value = index
    }
  }

  // 載入更多貼文（同一創作者）
  async function loadMorePosts(creatorId) {
    try {
      const { execute } = useRequest('Article.listByUser')
      const response = await execute({
        user_id: creatorId,
        page: 1,
        limit: 20
      })
      
      if (response && response.length > 0) {
        // 合併新的貼文到現有列表中，避免重複
        const existingIds = new Set(posts.value.map(post => post.id))
        const newPosts = response.filter(post => !existingIds.has(post.id))
        posts.value = [...posts.value, ...newPosts]
        
        // 預載相鄰貼文
        preloadAdjacentPosts()
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    }
  }

  // 預載相鄰貼文的媒體內容
  function preloadAdjacentPosts() {
    const currentIndex = currentPostIndex.value
    
    // 預載上一個和下一個貼文
    const preloadIndexes = [currentIndex - 1, currentIndex + 1].filter(
      index => index >= 0 && index < posts.value.length
    )
    
    preloadIndexes.forEach(index => {
      const post = posts.value[index]
      if (post && post.resource_type === 'video' && post.url[0]?.url) {
        // 預載視頻的 m3u8 首段
        preloadVideo(post.url[0].url)
      } else if (post && post.resource_type === 'image' && post.url) {
        // 預載圖片
        post.url.forEach(img => {
          if (img.url) {
            preloadImage(img.url)
          }
        })
      }
    })
  }

  // 預載視頻
  function preloadVideo(url) {
    try {
      // 創建一個隱藏的 video 元素來預載
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = url
      video.style.display = 'none'
      document.body.appendChild(video)
      
      // 載入後移除
      video.addEventListener('loadedmetadata', () => {
        document.body.removeChild(video)
      })
      
      video.addEventListener('error', () => {
        if (document.body.contains(video)) {
          document.body.removeChild(video)
        }
      })
    } catch (error) {
      console.warn('Failed to preload video:', error)
    }
  }

  // 預載圖片
  function preloadImage(url) {
    try {
      const img = new Image()
      img.src = url
    } catch (error) {
      console.warn('Failed to preload image:', error)
    }
  }

  // 切換到同一創作者的上一個貼文
  function goToPrevCreatorPost() {
    const creatorPosts = currentCreatorPosts.value
    const currentCreatorIndex = creatorPosts.findIndex(post => post.id === currentPost.value?.id)
    
    if (currentCreatorIndex > 0) {
      const prevPost = creatorPosts[currentCreatorIndex - 1]
      const globalIndex = posts.value.findIndex(post => post.id === prevPost.id)
      if (globalIndex !== -1) {
        setCurrentPost(globalIndex)
        setCurrentImage(0)
      }
    }
  }

  // 切換到同一創作者的下一個貼文
  function goToNextCreatorPost() {
    const creatorPosts = currentCreatorPosts.value
    const currentCreatorIndex = creatorPosts.findIndex(post => post.id === currentPost.value?.id)
    
    if (currentCreatorIndex < creatorPosts.length - 1) {
      const nextPost = creatorPosts[currentCreatorIndex + 1]
      const globalIndex = posts.value.findIndex(post => post.id === nextPost.id)
      if (globalIndex !== -1) {
        setCurrentPost(globalIndex)
        setCurrentImage(0)
      }
    }
  }

  return {
    // 狀態
    isOpen,
    posts,
    currentPostIndex,
    currentImageIndex,
    currentPost,
    currentCreatorPosts,
    
    // 方法
    open,
    close,
    setCurrentPost,
    setCurrentImage,
    loadMorePosts,
    goToPrevCreatorPost,
    goToNextCreatorPost,
    preloadAdjacentPosts
  }
})