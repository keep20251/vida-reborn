export default {
  // 取得自己用戶資訊
  info: { method: 'post', url: '/api/user/getUserInfo' },

  // 取得他人用戶資訊
  otherInfo: { method: 'post', url: '/api/user/getUserInfoByUuid' },

  // 修改信箱、用戶名、顯示名稱、興趣列表、語言、大頭照、背景照、自我介紹、社群連結
  modifyInfo: { method: 'post', url: '/api/user/modifyAccountInfo' },

  // 取得我的訂閱清單(無分類)
  listSubs: { method: 'post', url: '/api/user/mySubscribeList' },

  // 取得我的訂閱清單(按創作者分類)
  listSubsByCreator: { method: 'post', url: '/api/user/mySubscribeByCreatorList' },

  // 取得用戶自身帖子清單
  listArticle: { method: 'post', url: '/api/user/getArticleList' },

  // 檢舉原因取得
  listReportReasons: { method: 'post', url: '/api/user/reportreason' },

  // 檢舉用戶
  report: { method: 'post', url: '/api/user/report' },

  // 搜尋創作者
  searchCreator: { method: 'post', url: '/api/user/searchCreator' },

  getNewCreator: { method: 'post', url: '/api/user/getNewCreator' },

  // 取得用戶該時段總體收益
  stats: { method: 'post', url: '/api/user/getUserStatistic' },

  // 提現申請
  applyWithdraw: { method: 'post', url: '/api/user/applyWithdraw' },

  // 提現申請列表
  listWithdraw: { method: 'post', url: '/api/user/getWithdrawList' },

  // 刪除帳號
  deleteAccount: { method: 'post', url: '/api/user/deleteAccount' },

  // 封鎖或解除封鎖用戶
  block: { method: 'post', url: '/api/user/blockUserEvent' },

  // 取得用戶封鎖清單
  listBlock: { method: 'post', url: '/api/user/getBlockList' },

  // 重設密碼
  changePassword: { method: 'post', url: '/api/user/changePassword' },

  // 設立密碼
  setPassword: { method: 'post', url: '/api/user/setPassword' },

  // 申請成為創作者
  applyCreator: { method: 'post', url: '/api/user/applyCreator' },

  // 訪客興趣清單取得
  getGuestInterested: { method: 'post', url: '/api/user/getinterested' },

  // 訪客興趣清單儲存
  setGuestInterested: { method: 'post', url: '/api/user/updateinterested' },
}
