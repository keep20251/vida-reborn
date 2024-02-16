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
  bulkDel: { method: 'post', url: '/api/subscription/bulkDel'},
}
