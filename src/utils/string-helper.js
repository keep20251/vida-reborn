export const toCommaString = (number) => {
  number = number || 0
  return number >= 1000
    ? number
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number.toString()
}

export const toKiloString = (number) => {
  number = number || 0
  return number >= 1000 ? parseInt(number / 1000) + 'K' : number
}

export const toKiloRoundString = (number, fixed = 2) => {
  number = number || 0
  return number >= 1000 ? (number / 1000).toFixed(fixed) + 'K' : number
}

export const toKMBTString = (n, fixed = 1) => {
  n = parseFloat(n)
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(fixed) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(fixed) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(fixed) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(fixed) + 'T'
}

export const toFixedString = (number, fixed) => {
  number = number || 0
  return number.toFixed(fixed)
}

export const repairZero = (number) => {
  number = number || 0
  return number < 10 ? '0' + number : number
}

export const toDateYmd = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toDateTimeString = (date) => {
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${toDateYmd(date)} ${hour}:${minute}:${second}`
}

// dateString 格式為 YYYY-MM-DD HH:mm:ss
export const toDate = (dateString) => {
  const [datePart, timePart] = dateString.split(' ')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute, second] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

/**
 * 加入天數後返回新的 Date
 * @param {Number} days
 * @returns Date
 */
export const addDays = (days) => {
  const currentTime = new Date().getTime()
  const time = days * 24 * 60 * 60 * 1000
  return new Date(currentTime + time)
}

export const parseLink = (link, regex) => {
  const match = link.match(regex)
  return match ? match[1] : ''
}

/**
 * 解析社群連結，回傳 username
 */
export const parseAllLink = (value) =>
  parseLink(value, /(?:instagram\.com|twitter\.com|tiktok\.com|vida\.pub)\/([^?]+)/)

/**
 * 解析社群連結，重新拼湊成帶有 utm 的連結
 * @param {string} url
 * @returns
 */
export const addLinkQuery = (url) => {
  const urlMatches = url.match(
    /^(https:\/\/(?:www\.)?(?:instagram\.com|tiktok\.com|twitter\.com|vida\.pub)\/)(@?[^/]+)(\/?.*)$/,
  )
  if (!urlMatches) return url

  const domain = urlMatches[1]
  const username = urlMatches[2]

  const matches = username.match(/([^?]+)\?(.+)/)
  const tailQuery = '?utm_source=fantasi_one&utm_medium=referral'
  return matches ? `${domain}${matches[1]}${tailQuery}&${matches[2]}` : `${domain}${username}${tailQuery}`
}

export const cleanLink = (value, regex, prefix) => {
  const username = parseLink(value, regex)
  return username ? prefix + username : ''
}

export const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * 傳入一個物件，根據 key-value 拼湊成 query string
 * @param {object} obj
 * @returns
 */
export const toQueryString = (obj) => {
  const params = new URLSearchParams()
  Object.keys(obj).forEach((key) => params.append(key, obj[key]))
  return params.toString()
}
