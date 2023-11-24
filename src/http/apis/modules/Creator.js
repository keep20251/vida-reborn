/**
 * 創作者 API
 */
export default {
  // 创作者 - 待移动到后台 - 列表
  list: { method: 'post', url: '/api/creator/list' },

  // 创作者 - 申请
  apply: { method: 'post', url: '/api/creator/apply' },

  // 创作者 - 进度查询
  status: { method: 'post', url: '/api/creator/status' },

  // 创作者 - 推送信息创建
  pushcreate: { method: 'post', url: '/api/creatorcentor/pushcreate' },

  // 创作者 - 推送信息更改
  pushupdate: { method: 'post', url: '/api/creatorcentor/pushupdate' },

  // 创作者 - 推送信息列表
  pushlist: { method: 'post', url: '/api/creatorcentor/pushlist' },
}
