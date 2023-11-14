/**
 * 信用卡API
 */
export default {
  // 信用卡信息 - 列表
  list: { method: 'post', url: '/api/membercreditcard/list' },

  // 信用卡信息 - 新增
  create: { method: 'post', url: '/api/membercreditcard/create' },

  // 信用卡信息 - 更新
  update: { method: 'post', url: '/api/membercreditcard/update' },

  // 信用卡信息 - 删除
  delete: { method: 'post', url: '/api/membercreditcard/delete' },
}
