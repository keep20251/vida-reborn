export default {
  /**
   * 帖子一般操作
   */
  // 帖子列表
  list: { method: 'post', url: '/api/article/getList' },

  // 取得用戶興趣相關帖子
  listByInterested: { method: 'post', url: '/api/article/getArticleByInterseted' },

  // 指定創作者帖子列表
  listByUser: { method: 'post', url: '/api/article/getArticleByUser' },

  // 取得訂閱的帖子
  listSubscribe: { method: 'post', url: '/api/article/getSubscriptionArticle ' },

  // 帖子詳情
  detail: { method: 'post', url: '/api/article/getDetail' },

  // 喜歡帖子
  like: { method: 'post', url: '/api/article/like' },

  // 不喜歡帖子
  unlike: { method: 'post', url: '/api/article/unlike' },

  // 撈取帖子與創作者總數
  total: { method: 'post', url: '/api/article/totalCreatorAndArticle' },

  /**
   * 創作者帖子編輯操作
   */
  // 上傳帖子
  publish: { method: 'post', url: '/api/article/publish' },

  // 刪除帖子
  delete: { method: 'post', url: '/api/article/delete' },

  // 帖子管理
  listManagement: { method: 'post', url: '/api/article/managePost' },

  // 取得帖子詳情(用於編輯帖子)
  editDetail: { method: 'post', url: '/api/article/getArticleByIdForEdit' },

  // 取得所有主題分類
  categories: { method: 'post', url: '/api/article/getCategories' },

  // 取得用戶該時段的收益
  stats: { method: 'post', url: '/api/article/getArticleStatistic' },

  // 搜索
  hotKeywords: { method: 'post', url: '/api/article/getHotKeywords' },

  // 取得新的帖子視頻地址
  newVideoPath: { method: 'post', url: '/api/article/getVideoPath' },

  // 根據訂閱組Id取得帖子列表跟完整視頻地址
  newVideoPathBySub: { method: 'post', url: '/api/article/getVideoRealPath' },
}
