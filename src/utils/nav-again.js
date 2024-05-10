const HOME_AGAIN_LISTENERS = []
const SEARCH_AGAIN_LISTENERS = []
const MESSAGE_AGAIN_LISTENERS = []
const MINE_AGAIN_LISTENERS = []

function addAgainListener(listeners, listener) {
  // 伺服器端不需要
  if (import.meta.env.SSR) {
    return
  }

  if (typeof listener !== 'function') {
    throw new Error('listener must be a function...')
  }

  listeners.push(listener)

  return () => {
    const i = listeners.indexOf(listener)
    if (i < 0) {
      throw new Error('There is no listener...')
    }
    listeners.splice(i, 1)
  }
}
function notifyAgainListeners(listeners, args) {
  listeners.forEach((listener) => listener.apply(null, args))
}

export function whenNavHomeAgain(listener) {
  return addAgainListener(HOME_AGAIN_LISTENERS, listener)
}
export function whenNavSearchAgain(listener) {
  return addAgainListener(SEARCH_AGAIN_LISTENERS, listener)
}
export function whenNavMessageAgain(listener) {
  return addAgainListener(MESSAGE_AGAIN_LISTENERS, listener)
}
export function whenNavMineAgain(listener) {
  return addAgainListener(MINE_AGAIN_LISTENERS, listener)
}

export function navHomeAgain(...args) {
  notifyAgainListeners(HOME_AGAIN_LISTENERS, args)
}
export function navSearchAgain(...args) {
  notifyAgainListeners(SEARCH_AGAIN_LISTENERS, args)
}
export function navMessageAgain(...args) {
  notifyAgainListeners(MESSAGE_AGAIN_LISTENERS, args)
}
export function navMineAgain(...args) {
  notifyAgainListeners(MINE_AGAIN_LISTENERS, args)
}
