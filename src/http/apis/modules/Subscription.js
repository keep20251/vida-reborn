export default {
  // 建立訂閱方案
  create: { method: 'post', url: '/api/subscription/create' },

  // 編輯更新訂閱方案
  update: { method: 'post', url: '/api/subscription/update' },

  // 檢查當前用戶是否存在訂閱方案
  exists: { method: 'post', url: '/api/subscription/checkSubscriptionExists' },

  // 取得當前用戶自訂的訂閱方案列表
  list: { method: 'post', url: '/api/subscription/mySubscription' },

  // 取得 uuid 的訂閱方案列表
  otherList: { method: 'post', url: '/api/subscription/listSubscriptionByUuid' },

  // 刪除訂閱方案
  bulkDel: { method: 'post', url: '/api/subscription/bulkDel' },

  /**
   * 根據帖子取得訂閱方案列表
   * @link http://172.104.167.6:8083/#/%E4%B8%BB%E9%A1%B5/GetArticleSubscription
   */
  getArticleSubscription: { method: 'post', url: '/api/article/getArticleSubscription' },

  /**
   * 根據訂閱方案取得帖子列表
   * @link http://172.104.167.6:8083/#/%E4%B8%BB%E9%A1%B5/GetSubscriptionArticles
   */
  getSubscriptionArticles: { method: 'post', url: '/api/article/getSubscriptionArticles' },

  // 編輯訂閱方案排序
  updateSort: { method: 'post', url: '/api/subscription/updateSort' },
}
