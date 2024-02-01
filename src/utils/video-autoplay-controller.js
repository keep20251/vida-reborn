/**
 * [
 *   {
 *     play: () => {}
 *     payse: () => {}
 *   },
 *   ...
 * ]
 */
const playList = []

const idMaker = (function* () {
  let id = 0
  while (true) {
    yield id++
  }
})()

export function add(videoAction) {
  if (typeof videoAction.play !== 'function' || typeof videoAction.pause !== 'function') {
    throw new Error('videoAction play and pause function is required...')
  }

  const id = idMaker.next().value

  playList.push({ ...videoAction, id })

  if (playList.length === 1) {
    videoAction.play()
  }

  return id
}

export function remove(id) {
  if (typeof id !== 'number') {
    return
  }

  const removeIndex = playList.findIndex((va) => va.id === id)
  if (removeIndex < 0) {
    return false
  }

  const videoAction = playList[removeIndex]

  if (removeIndex === 0) {
    videoAction.pause()
    playList.shift()
    if (playList.length > 0) {
      playList[0].play()
    }
  } else {
    playList.splice(removeIndex, 1)
  }

  return true
}
