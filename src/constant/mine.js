import { USER_PERM } from '.'

export const PERM_TABLE = {
  [USER_PERM.VISITOR]: {
    avatar: false,
    subscribers: false,
    profile: false,
    postEarn: false,
    buyCollect: false,
    beCreator: true,
    settings: false,
    logout: false,
  },
  [USER_PERM.USER]: {
    avatar: true,
    subscribers: false,
    profile: false,
    postEarn: false,
    buyCollect: true,
    beCreator: true,
    settings: true,
    logout: true,
  },
  [USER_PERM.CREATOR]: {
    avatar: true,
    subscribers: true,
    profile: true,
    postEarn: true,
    buyCollect: true,
    beCreator: false,
    settings: true,
    logout: true,
  },
}

// 因為會直接拿來跟 route.query 的參數做比對，所以用字串
export const POST_TAB_TYPE = {
  SUB: '1',
  BUY: '2',
  SCH: '3',
  PRI: '4',
}
