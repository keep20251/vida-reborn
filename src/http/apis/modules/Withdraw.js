/**
 * 提現 API
 */
export default {
  // 用户提现信息 - 创建
  create: { method: 'post', url: '/api/member/withdrawlogcreate' },

  // 用户提现信息 - 列表
  list: { method: 'post', url: '/api/member/withdrawloglist' },
}
