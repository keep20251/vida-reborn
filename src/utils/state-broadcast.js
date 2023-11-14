export const TYPES = {
  FOLLOW: 'follow',
  SUB: 'sub',
  BUY: 'buy',
  LIKE: 'like',
  BLOCK: 'block',
  OPENING: 'opening', // 開幕活動
}

const OBSERVERS = {
  [TYPES.FOLLOW]: [],
  [TYPES.SUB]: [],
  [TYPES.BUY]: [],
  [TYPES.LIKE]: [],
  [TYPES.BLOCK]: [],
  [TYPES.OPENING]: [],
}

export function on(type, listener) {
  typeCheck(type)

  if (typeof listener !== 'function') {
    throw new Error('listener must be a function...')
  }

  const listeners = OBSERVERS[type]
  listeners.push(listener)

  // console.log('state-broadcast add', type, OBSERVERS[type])
  // 回傳監聽取消操作
  return () => {
    const i = listeners.indexOf(listener)
    if (i < 0) {
      console.error(`listener ${type} already removed, but you still remove it again...`, listener)
      return
    }
    listeners.splice(i, 1)
    // console.log('state-broadcast remove', type, i, OBSERVERS[type])
  }
}

function emit(type, ...args) {
  typeCheck(type)

  const listeners = OBSERVERS[type]
  listeners.forEach((listener) => {
    listener.apply(null, args)
  })
}

export function notifyFollow(userId, isFollow) {
  emit(TYPES.FOLLOW, userId, isFollow)
}

export function notifySub(userId, isSubscribe = true) {
  emit(TYPES.SUB, userId, isSubscribe)
}

export function notifyBuy(feedId, isBuy = true) {
  emit(TYPES.BUY, feedId, isBuy)
}

export function notifyLike(feedId, isLike) {
  emit(TYPES.LIKE, feedId, isLike)
}

export function notifyBlock(userId, isBlock) {
  emit(TYPES.BLOCK, userId, isBlock)
}

export function notifyCampaign() {
  emit(TYPES.OPENING)
}

function typeCheck(type) {
  if (![TYPES.SUB, TYPES.BUY, TYPES.FOLLOW, TYPES.LIKE, TYPES.BLOCK, TYPES.OPENING].includes(type)) {
    throw new Error(`Type ${type} is not supported in state-broadcast...`)
  }
}
