import encrypt from './encrypt'

/**
 * 全域Request攔截器
 * 放在這裡的攔截器會在每次Request時都被執行
 * 使用到的攔截器務必要回傳 request
 */
const requestInterceptor = [encrypt]
export default requestInterceptor
