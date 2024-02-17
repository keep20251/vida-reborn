let appConfig = null

let categories = null

export function clear() {
  appConfig = null
  categories = null
}

export function getAppConfig() {
  return appConfig
}
export function cacheAppConfig(v) {
  appConfig = v
}

export function getCategories() {
  return categories
}
export function cacheCategories(v) {
  categories = v
}
