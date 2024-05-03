export default function velocityCalculator() {
  const positionQueue = []
  const timeQueue = []

  function reset() {
    positionQueue.splice(0)
    timeQueue.splice(0)
  }

  function pruneQueue(ms) {
    const thresholdTime = Date.now() - ms

    let deleteCount = timeQueue.findIndex((t) => t >= thresholdTime)
    deleteCount = deleteCount === -1 ? timeQueue.length : deleteCount

    timeQueue.splice(0, deleteCount)
    positionQueue.splice(0, deleteCount)
  }

  function updatePosition(position) {
    positionQueue.push(position)
    timeQueue.push(Date.now())
    pruneQueue(50)
  }

  function getVelocity() {
    pruneQueue(1000)
    const length = timeQueue.length
    if (length < 2) return 0

    const distance = positionQueue[length - 1] - positionQueue[0]
    const time = (timeQueue[length - 1] - timeQueue[0]) / 1000

    return distance / time
  }

  return {
    reset,
    updatePosition,
    getVelocity,
  }
}
