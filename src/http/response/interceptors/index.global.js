import process from './process.js'
import decrypt from './decrypt.js'

/**
 * 全域 Response 攔截器
 * 放在這裡的攔截器會在每次 Response 時都被執行
 * 使用到的攔截器務必要回傳 response
 */
const responseInterceptor = [process, decrypt]
// const responseInterceptor = []
export default responseInterceptor
