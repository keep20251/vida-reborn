/**
 * 消費紀錄 API
 */
export default {
  // 用户消费记录 - 列表
  list: { method: 'post', url: '/api/memberpay/list' },

  // 用户消费记录 - 删除
  delete: { method: 'post', url: '/api/memberpay/delete' },
}
