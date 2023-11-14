/**
 * 帳號API
 */
export default {
  // 用户信息 - 登录
  login: { method: 'post', url: '/api/member/login' },

  // 用户信息 - 详情
  detail: { method: 'post', url: '/api/member/detail' },

  // 用户信息 - 注册
  register: { method: 'post', url: '/api/member/register' },

  // 用户信息 - 更新
  update: { method: 'post', url: '/api/member/update' },

  // 用户信息 - 退出
  delete: { method: 'post', url: '/api/member/delete' },

  // 用户密码 - 更新
  passwd: { method: 'post', url: '/api/member/passwd' },

  // 用户社交链接 - 更新
  socialLink: { method: 'post', url: '/api/member/socialLink' },

  // 用户信息 - 喜好
  fondness: { method: 'post', url: '/api/member/fondness' },

  // 用户信息 - 语言設置
  language: { method: 'post', url: '/api/member/language' },

  exists: { method: 'post', url: '/api/member/checkexists' },

  // 用戶訂閱信息 - 列表
  getsubscribelist: { method: 'post', url: '/api/member/getsubscribelist' },
}
