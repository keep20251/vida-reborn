export default {
  // 訂閱創作者方案
  sub: { method: 'post', url: '/api/payment/subscriptionCreater' },

  // 購買帖子
  buy: { method: 'post', url: '/api/payment/buyPost' },

  // 取消訂閱
  cancelSub: { method: 'post', url: '/api/payment/cancelSubscription' },

  // 購買歷史紀錄
  history: { method: 'post', url: '/api/payment/orderHistory' },
}
