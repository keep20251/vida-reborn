const HOME_AGAIN_LISTENERS = []

export function whenHomeAgain(listener) {
  // 伺服器端不需要
  if (import.meta.env.SSR) {
    return
  }

  if (typeof listener !== 'function') {
    throw new Error('listener must be a function...')
  }

  HOME_AGAIN_LISTENERS.push(listener)

  return () => {
    const i = HOME_AGAIN_LISTENERS.indexOf(listener)
    if (i < 0) {
      throw new Error('There is no listener...')
    }
    HOME_AGAIN_LISTENERS.splice(i, 1)
  }
}

export function navHomeAgain(...args) {
  HOME_AGAIN_LISTENERS.forEach((listener) => {
    listener.apply(null, args)
  })
}
