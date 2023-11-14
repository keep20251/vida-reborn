/**
 * 主頁 API
 */
export default {
  // 视频点赞
  like: { method: 'post', url: '/api/home/like' },

  // 视频取消点赞
  unlike: { method: 'post', url: '/api/home/unlike' },

  // 舉報
  report: { method: 'post', url: '/api/home/report' },

  // 取得舉報原因選項
  getReportReason: { method: 'post', url: '/api/member/reportreason' },

  reward: { method: 'post', url: '/api/home/reward' },

  rewardCheck: { method: 'post', url: '/api/home/rewardCheck' },

  subscribe: { method: 'post', url: '/api/home/subscribe' },

  // 取消订阅创作者
  cancelSubscribe: { method: 'post', url: '/api/home/cancelSubscribe' },

  checkSubscribePay: { method: 'post', url: '/api/home/checkSubscribePay' },

  shopBuy: { method: 'post', url: '/api/home/shopBuy' },

  shopCheckBuy: { method: 'post', url: '/api/home/shopCheckBuy' },

  unlockAll: { method: 'post', url: '/api/member/unlockAll' },

  unlockCheckBuy: { method: 'post', url: '/api/member/unlockCheckBuy' },
}
