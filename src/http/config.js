/**
 * @description: http请求配置
 */
export default {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
}
