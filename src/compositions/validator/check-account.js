import API from '@/http'

export const useCheckAccount = () => {
  const check = async (obj, type) => {
    if (!('value' in obj) || !(`canUse` in obj) || !(`error` in obj))
      throw new Error('[check-account]] Object is not valid.')
    if (!obj.value) return

    try {
      const response = await API.Auth.exists({ data: { type, name: obj.value } })
      if (!response) {
        obj.error = '已被使用'
        console.log('已被使用')
      }
      obj.canUse = response
    } catch (e) {
      console.error(`[check-account] ${e}`)
    }
  }

  return { check }
}
