export default {
  // 主頁已關注 tab
  getFollowedList: { method: 'post', url: '/api/home/getfollowvideolist' },

  // 主頁推薦 tab
  // 使用 last 模式無限取得
  getRecommendVideoList: { method: 'post', url: '/api/home/videos' },
  getRecommendPhotoList: { method: 'post', url: '/api/home/images' },

  // 主頁熱門 tab
  getPopularSetList: { method: 'post', url: '/api/home/hots' },
  getPopularSet: { method: 'post', url: '/api/home/hotsData' },

  // 使用 page limit 模式無限取得
  // aff 查使用者
  // tag 查標籤
  // keyword 查關鍵字
  getVideoList: { method: 'post', url: '/api/home/getVideoList' },
  getPhotoList: { method: 'post', url: '/api/home/getPhotoList' },
  getShopList: { method: 'post', url: '/api/home/getShopList' },
  getFavorite: { method: 'post', url: '/api/home/getFavorite' },

  // 搜索 Tag 列表
  searchTags: { method: 'post', url: '/api/home/searchtags' },

  // 創作者列表
  creators: { method: 'post', url: '/api/home/creators' },

  // 分享連結的時候調用讓後端統計
  share: { method: 'post', url: '/api/home/share' },

  // 流量統計
  stat: { method: 'post', url: '/api/home/play' },
}
