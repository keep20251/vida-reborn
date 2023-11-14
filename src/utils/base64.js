/**
 * 簡易base64加密
 * @param {String} str
 * @returns base64亂碼，可用於url
 */
export const encrypt = (str) => encodeURIComponent(btoa(str))

/**
 * 簡易base64解密
 * @param {String} str
 * @returns base64亂碼，可用於url
 */
export const decrypt = (str) => atob(decodeURIComponent(str))
