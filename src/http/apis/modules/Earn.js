/**
 * 創作者中心（收益） API
 */
export default {
  // 數據儀表板 - 總餘額
  balance: { method: 'post', url: '/api/creatorcentor/balance' },

  // 數據儀表板 - 整體表現
  income: { method: 'post', url: '/api/creatorcentor/income' },

  // 數據儀表板 - 整體表現
  incomedetail: { method: 'post', url: '/api/creatorcentor/incomedetail' },

  // 媒體表現 - 列表
  media: { method: 'post', url: '/api/creatorcentor/media' },

  // 媒體表現 - 統計
  count: { method: 'post', url: '/api/creatorcentor/count' },
}
