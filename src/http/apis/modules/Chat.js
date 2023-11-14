/**
 * 訊息歷史紀錄
 */
export default {
  // 聯絡人列表
  getContactList: { method: 'post', url: '/api/chat/getContactList' },

  // 訊息列表
  getHistory: { method: 'post', url: '/api/chat/getHistory' },
}
