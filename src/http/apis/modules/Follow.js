/**
 * 關注API
 */
export default {
  // 用户关注信息 - 列表
  list: { method: 'post', url: '/api/memberfollow/list' },

  //   用户关注信息 - 操作
  update: { method: 'post', url: '/api/memberfollow/update' },
}
