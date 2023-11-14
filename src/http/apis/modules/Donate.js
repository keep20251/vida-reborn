/**
 * 打賞 API
 */
export default {
  // 打赏信息 - 创建
  create: { method: 'post', url: '/api.php/api/membersalary/create' },

  // 打赏信息 - 删除
  delete: { method: 'post', url: '/api.php/api/membersalary/delete' },

  // 打赏信息 - 列表
  list: { method: 'post', url: '/api.php/api/membersalary/list' },
}
