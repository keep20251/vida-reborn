export default {
  /** 訂閱創作者 */
  sub: { method: 'post', url: '/api/payment/subscriptionCreater' },

  /** 購買帖子 */
  buy: { method: 'post', url: '/api/payment/buyPost' },

  /** 輪詢訂單狀態 */
  check: { method: 'post', url: '/api/payment/checkOrderStatus' },

  /** 取消訂閱 */
  cancelSub: { method: 'post', url: '/api/payment/cancelSubscription' },

  /** 購買歷史紀錄 */
  history: { method: 'post', url: '/api/payment/orderHistory' },

  /** 获取visa支付信息 */
  getStripeKey: { method: 'post', url: '/api/user/getPaymentInfo' },

  /** 取得目前金流與金流Group */
  getAllPayment: { method: 'post', url: '/api/home/getPayTypeWithId' },
}
