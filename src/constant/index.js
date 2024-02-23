export const COOKIE_KEY = {
  AUTH: '__AUTH',
  GUEST_ID: '__GUEST_ID',
  LOCALE: '__LOCALE',
  USERNAME: '__USERNAME',
  AFF: '__AFF',
  UUID: '__UUID',
}

// 登入與註冊流程的路由設置
export const AUTH_ROUTES = {
  MAIN_PAGE: 1,
  LOGIN: 2,
  SIGN_UP: 3,
  VERIFY_EMAIL_CODE: 4,
  VERIFY_PASSWORD: 5,
  SIGN_UP_SUCCESS: 6,
}

// 訂閱方案流程
export const SUB_PLAN = {
  MAIN_PAGE: 1,
  SET: 2,
}

export const LOCAL_STORAGE_KEYS = {
  ACCOUNT_INFO: '__ACCOUNT_INFO',
  LOCALE: '__LOCALE',
  COOKIE_AGREEMENT: '__COOKIE_AGREEMENT',
  FEED_TAGS: '__FEED_TAGS',
  HISTORY_TAGS: '__HISTORY_TAGS',
}

export const MODAL_TYPE = {
  ALERT: 1,
  CONFIRM: 2,
  PROGRESS: 3,

  SOCIAL_LINK: 10,
  SIGN_UP_SUCCESS: 11,
  REPORT: 12,

  INTERESTED_PICK: 20,
  APPLY_CREATOR_CERT: 21,
  PHOTO_CAPTURE: 22,

  // 支付相關
  SUBSCRIBE: 30,
  PAYING: 31,
  SHOP_BUY: 32,
  SUBSCRIBE_SUCCESS: 33,
  SHOP_BUY_SUCCESS: 34,

  PRIVACY_POLICY: 97,
  TERMS_OF_SERVICE: 98,
  COOKIE_POLICY: 99,
  TEST: 999,
}

export const USER_PERM = {
  VISITOR: 1,
  USER: 2,
  CREATOR: 3,
}

export const SEND_EMAIL_PURPOSE = {
  BIND_PHONE: 1, // 綁定手機
  UNBIND_PHONE: 2, // 解綁手機
  GET_ACCOUNT_BACK: 3, // 找回帳號
  VERIFY_EMAIL: 4, // 驗證信箱
  FAST_LOGIN: 5, // 快速登入
}

// 用來 Mapping路由名稱與title
export const MINE_TITLE = {
  'mine-home': 'title.mine',
  'mine-earn': 'title.mineEarn',
  'mine-earn-wdrl-req': 'title.earnWdrlReq',
  'mine-earn-wdrl-hist': 'title.earnWdrlHist',
  'mine-buy': 'title.mineBuy',
  'mine-post': 'title.minePost',
  'mine-collect': 'title.mineCollect',
  'mine-creator': 'title.beCreator',
  'mine-creator-agreement': 'title.beCreator',
  'mine-creator-identity-agreement': 'title.beCreator',
  'mine-creator-take-picture': 'title.beCreator',
  'mine-account': 'title.usnMail',
  'mine-password': 'title.password',
  'mine-preference': 'title.prefer',
  'mine-block': 'title.blockAcc',
  'mine-delete': 'title.delAcc',
  'mine-tos': 'title.tos',
  'mine-pp': 'title.pp',
  'mine-cp': 'title.cp',
  'mine-dmca': 'DMCA',
}

// 信箱驗證與否
export const EMAIL_VALIDATION = {
  UNVERIFIED: 0,
  VERIFIED: 1,
}

// 封鎖或解除封鎖 - 操作
export const BLOCK_ACTION = {
  BLOCK: 1, // 添加封鎖
  UNBLOCK: 2, // 解除封鎖
}

// userData 作者狀態
export const AUTH_STATUS = {
  UNVERIFIED: 0, // 尚未驗證
  VERIFIED: 1, // 已驗證
  CREATOR: 2, // 已成為創作者
  BANNED_CREATOR: 3, // 被封禁的創作者
}

// 提交紀錄 - 申請狀態
export const WITHDRAW_LIST_STATUS = {
  PAID: 1,
  NOT_REVIEWED: 15,
  FAIL: 10,
  UNDER_REVIEW: 5,
}

export const BECOME_CREATOR_IDENTITY = {
  PASSPORT: 1,
  IDENTITY_CARD: 2,
  DRIVER_LICENSE: 3,
}

export const SEARCH_TAB = {
  AUTHOR: 1,
  POST: 2,
}

// 我的購買 - 頁籤
export const MINE_BUY_TAB = {
  TRANSACTION: 1,
  SUBSCRIPTION: 2,
  PURCHASED_ARTICLE: 3,
}

// 我的購買 - 訂閱狀態
export const SUB_STATUS = {
  RESTORE_SUB: 1, // 「恢復訂閱」:取消訂閱後，但尚未到期的狀態，若按下恢復訂閱回狀態 2
  CANCEL_SUB: 2, // 「取消訂閱」:訂閱後文案都是續定狀態，若按下取消訂閱下期不會自動續約，會回狀態 1
  RE_SUB: 3, // 「重新訂閱」:前端打付款介面，用戶要去付款，付款成功改回狀態 2
  SUB_IN_ADVANCE: 4, // 「提前續訂」:如果第三方支付判定用戶只能單次買斷一個月，就會有狀態 4
}

// 我的購買 - 取消訂閱的操作類型
export const CANCEL_SUB_TYPE = {
  CANCEL_SUB: 0, // 「取消訂閱」為預設值
  RESTORE_SUB: 1, // 「恢復訂閱」
  RE_SUB: 2, // 「重新訂閱」
  SUB_IN_ADVANCE: 3, // 「提前續訂」
}

// 取得用戶自身帖子列表
export const GET_ARTICLE_LIST = {
  BOUGHT: 1, // 已購買
  LIKE: 2, // 按讚收藏
}

// 我的收藏 - 頁籤
export const MINE_COLLECT_TAB = {
  ALL: 1,
  UNLOCKED: 2,
  NOT_UNLOCKED: 3,
}

// 取得用戶自身帖子列表 - 按讚收藏解鎖狀態
export const GET_ARTICLE_COLLECT = {
  UNLOCKED: 0,
  NOT_UNLOCKED: 1,
}

// 消費類型
export const CONSUME_TYPE = {
  REWARD: 1,
  SUBSCRIBE: 5,
  SHOP_BUY: 10,
  UNLOCK: 15,
}

// 訂閱方案的狀態
export const SUB_PLAN_STATUS = {
  DISABLE: 0,
  ENABLE: 1,
}

// 我的收益 - 頁籤
export const MINE_EARN_TAB = {
  OVERALL_PREF: 1,
  POST_PREF: 2,
}
