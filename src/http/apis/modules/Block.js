/**
 * 用戶封鎖API
 */
export default {
  // 用户拉黑信息 - 列表
  list: { method: 'post', url: '/api/memberblock/list' },

  // 用户拉黑信息 - 操作
  update: { method: 'post', url: '/api/memberblock/update' },
}
