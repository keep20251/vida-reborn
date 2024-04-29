let appConfig = null
let categories = null

export async function getAppConfig(defaultFetcher) {
  if (appConfig === null) {
    appConfig = await defaultFetcher()
  }
  return appConfig
}

export async function getCategories(defaultFetcher) {
  if (categories === null) {
    categories = await defaultFetcher()
  }
  return categories
}

export function clear() {
  appConfig = null
  categories = null
}
