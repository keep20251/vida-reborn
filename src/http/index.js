import axios from 'axios'
import config from './config'
import globalRequestInterceptors from './request/interceptors/index.global'
import globalResponseInterceptors from './response/interceptors/index.global'
import globalRequestErrorHandlers from './request/error-handlers/index.global'
import globalResponseErrorHandlers from './response/error-handlers/index.global'
import apis from './apis'
import { mapValues } from 'lodash'

const instance = axios.create(config)

/**
 * Basic Request攔截器
 * @param {Array} interceptors
 * @param {Array} errorHandler
 */
const requestInterceptor = (interceptors, errorHandler) => {
  instance.interceptors.request.use(
    function onBeforeSend(request) {
      const newResponse = interceptors.reduce((accumulator, currentValue) => currentValue(accumulator), request)
      return newResponse
    },
    function onError(error) {
      if (errorHandler.length > 0) errorHandler.forEach((handler) => handler(error))
      return Promise.reject(error)
    },
  )
}

/**
 * Basic Response攔截器
 * @param {Array} interceptors
 * @param {Array} errorHandlers
 */
const responseInterceptor = (interceptors, errorHandlers) => {
  instance.interceptors.response.use(
    function onAfterReceived(response) {
      const newResponse = interceptors.reduce((accumulator, currentValue) => currentValue(accumulator), response)
      return newResponse
    },
    function onError(error) {
      if (errorHandlers.length > 0) errorHandlers.forEach((handler) => handler(error))
      return Promise.reject(error)
    },
  )
}

/** 載入全域執行攔截器 */
requestInterceptor(globalRequestInterceptors, globalRequestErrorHandlers)
responseInterceptor(globalResponseInterceptors, globalResponseErrorHandlers)

/**
 * @description 封裝Axios的HTTP請求
 * @tutorial https://axios-http.com/docs/config_defaults
 * @param { String } method 請求方法
 * @param { String } url 請求路徑
 * @param { Object } data 請求參數
 * @param { Object } config 請求設定
 * @returns
 */
export function http(method, url, data = null, config = null) {
  method = method.toUpperCase()
  try {
    switch (method) {
      case 'GET':
        return instance.get(url, { params: data, ...config })
      case 'POST':
        return instance.post(url, data, config)
      case 'PUT':
        return instance.put(url, data, config)
      case 'DELETE':
        return instance.delete(url, { params: data, ...config })
      case 'PATCH':
        return instance.patch(url, data, config)
      default:
        throw new Error(`未知的 Method: ${method}`)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * @description 提供外部注入Request攔截器
 * @param {Function} interceptor
 * @param {Function} handler
 */
export function onRequestInterceptor(interceptor, handler = null) {
  requestInterceptor([interceptor], [handler])
}

/**
 * @description 提供外部注入Response攔截器
 * @param {Function} interceptor
 * @param {Function} handler
 */
export function onResponseInterceptor(interceptors, handler = null) {
  responseInterceptor([interceptors], [handler])
}

/**
 * API modules
 */
const API = Object.freeze(
  mapValues(apis, (mod, modName) =>
    Object.freeze(
      mapValues(mod, (conf, confName) => {
        if (!conf.method) {
          console.warn(`API module ${modName}.${confName} have no 'method' field, it's required.`)
        }

        if (!conf.url) {
          console.warn(`API module ${modName}.${confName} have no 'url' field, it's required.`)
        }
        return ({ data = null, config = null } = {}) => {
          const combineConfig = { ...conf.config, ...config }
          return http(conf.method, conf.url, data, combineConfig)
        }
      }),
    ),
  ),
)

export default API
