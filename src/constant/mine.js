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
    postEarn: true, // 暫打開
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
