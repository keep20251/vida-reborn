export const COOKIE_KEY = {
  AUTH: '__AUTH',
  GUEST_ID: '__GUEST_ID',
  LOCALE: '__LOCALE',
  USERNAME: '__USERNAME',
  AFF: '__AFF',
  UUID: '__UUID',
  CHAT_TOKEN: '__CHAT_TOKEN',
  USER_DATA: '__USER_DATA',
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

export const LOCAL_STORAGE_KEYS = {
  ACCOUNT_INFO: '__ACCOUNT_INFO',
  LOCALE: '__LOCALE',
  COOKIE_AGREEMENT: '__COOKIE_AGREEMENT',
}

export const MODAL_TYPE = {
  ALERT: 1,
  CONFIRM: 2,

  SOCIAL_LINK: 10,
  SIGN_UP_SUCCESS: 11,

  INTERESTED_PICK: 20,
  APPLY_CREATOR_CERT: 21,

  PRIVACY_POLICY: 97,
  TERMS_OF_SERVICE: 98,
  COOKIE_POLICY: 99,
  TEST: 999,
}

// 角色判斷顯示內容
export const PERMISSION = {
  VISITOR: {
    avatar: false,
    subscribers: false,
    profile: false,
    registerLogin: true,
    postEarn: false,
    buyCollect: false,
    beCreator: true,
    settings: false,
    logout: false,
  },
  REGISTERED: {
    avatar: true,
    subscribers: false,
    profile: false,
    registerLogin: false,
    postEarn: false,
    buyCollect: true,
    beCreator: true,
    settings: true,
    logout: true,
  },
  CREATOR: {
    avatar: true,
    subscribers: true,
    profile: true,
    registerLogin: false,
    postEarn: true,
    buyCollect: true,
    beCreator: false,
    settings: true,
    logout: true,
  },
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
  'mine-earn': 'title.earn',
  'mine-buy': 'title.buy',
  'mine-post': 'title.post',
  'mine-collect': 'title.collect',
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
export const BLOCK_UPDATE = {
  ADD_BLOCK: 1, // 添加封鎖
  CANCEL_BLOCK: 2, // 解除封鎖
}