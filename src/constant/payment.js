/** 支付的顯示方式 */
export const PAYMENT_TYPE = {
  POPUP: 'popup-payment',
  EMBED: 'embed-payment',
}

export const PAYMENT_GROUP = {
  OTHER: 0, // 這個不是後端綁定的，是前端自己定義的
  ALI_PAY: 1,
  LINE_PAY: 2,
  PAYPAL: 3,
  UNION_PAY: 4,
  CREDIT_CARD: 5,
}
