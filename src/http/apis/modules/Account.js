export default {
  // 密碼註冊
  registerByPassword: { method: 'post', url: '/api/account/registerByPassword' },

  // 密碼登入
  loginByPassword: { method: 'post', url: '/api/account/loginByPassword' },

  // 信箱登入
  loginByEmail: { method: 'post', url: '/api/account/loginByEmail' },

  // 信箱是否被驗證過
  emailUsed: { method: 'post', url: '/api/account/isUseEmail' },

  // 信箱驗證
  validationEmail: { method: 'post', url: '/api/account/validationEmail' },

  // 信箱驗證碼寄送
  sendEmailCode: { method: 'post', url: '/api/account/sendEmailCode' },

  // 取得條款政策聲明
  getDeclare: { method: 'post', url: '/api/account/getDeclare' },

  isUsedEmail: { method: 'post', url: '/api/account/isUseEmail' },
}
