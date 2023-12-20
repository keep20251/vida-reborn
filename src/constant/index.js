export const COOKIE_KEY = {
  AUTH: '__AUTH',
  GUEST_ID: '__GUEST_ID',
  LOCALE: '__LOCALE',
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
}

// 角色判斷顯示內容
export const PERMISSION = {
  VISITOR: {
    avatar: false,
    subscribers: false,
    posts: false,
    profile: false,
    register: true,
    login: true,
    earn: false,
    buyList: false,
    post: false,
    collect: false,
    settings: false,
    language: true,
    about: true,
    logout: false,
  },
  REGISTERED: {
    avatar: true,
    subscribers: true,
    posts: false,
    profile: false,
    register: false,
    login: false,
    earn: false,
    buyList: true,
    post: false,
    collect: false,
    settings: true,
    language: true,
    about: true,
    logout: true,
  },
  CREATOR: {
    avatar: true,
    subscribers: true,
    posts: true,
    profile: true,
    register: false,
    login: false,
    earn: true,
    buyList: true,
    post: true,
    collect: true,
    settings: true,
    language: true,
    about: true,
    logout: true,
  },
}
