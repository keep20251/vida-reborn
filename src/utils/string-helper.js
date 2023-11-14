export const toCommaString = (number) =>
  number >= 1000
    ? number
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : number.toString()

export const toKiloString = (number) => (number >= 1000 ? parseInt(number / 1000) + 'K' : number)

export const toKiloRoundString = (number, fixed = 2) => (number >= 1000 ? (number / 1000).toFixed(fixed) + 'K' : number)

export const toFixedString = (number, fixed) => number.toFixed(fixed)

export const repairZero = (number) => (number < 10 ? '0' + number : number)

export const toDateYmd = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
