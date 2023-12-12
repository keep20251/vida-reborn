export default {
  // 指定對象訊息歷史紀錄
  history: { method: 'post', url: '/api/chat/getHistory' },

  // 訊息列表
  contactList: { method: 'post', url: '/api/chat/getContactList' },
}
