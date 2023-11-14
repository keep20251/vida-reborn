export const transBlobToUrl = (blob) => {
  return URL.createObjectURL(blob)
}

export const unRefAdKeysArray = (items, ...keys) => {
  const unRefArray = []
  items.forEach((item) => {
    const newObj = {}
    Object.entries(item).forEach(([key, value]) => {
      newObj[key] = value
    })
    keys.forEach((key) => {
      newObj[key] = null
    })
    unRefArray.push(newObj)
  })
  return unRefAdKeysArray
}

export const unRefArray = (items) => {
  const unRefArray = []
  items.forEach((item) => {
    const newObj = {}
    Object.entries(item).forEach(([key, value]) => {
      newObj[key] = value
    })
    unRefArray.push(newObj)
  })
  return unRefArray
}
