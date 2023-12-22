import * as Yup from 'yup'
import { useI18nInstance } from '@use/utils/i18n'

const { $t } = useI18nInstance()

export const initial = () => {
  Yup.setLocale({
    mixed: {
      default: $t('yup.mixed.default'),
      required: $t('yup.mixed.required'),
    },
    string: {
      length: ({ length }) => ({ key: `yup.string.length`, values: { length } }),
      min: ({ min }) => ({ key: `yup.string.min`, values: { min } }),
      max: ({ max }) => ({ key: `yup.string.max`, values: { max } }),
      matches: () => ({
        key: `yup.string.matches`,
      }),
      email: () => ({
        key: `yup.string.email`,
      }),
      url: () => ({
        key: `yup.string.url`,
      }),
      uuid: () => ({
        key: `yup.string.uuid`,
      }),
      ensure: () => ({
        key: `yup.string.ensure`,
      }),
      trim: () => ({
        key: `yup.string.trim`,
      }),
      lowercase: () => ({
        key: `yup.string.lowercase`,
      }),
      uppercase: () => ({
        key: `yup.string.uppercase`,
      }),
      instagram: () => ({ key: `yup.string.instagram` }),
      twitter: () => ({ key: `yup.string.twitter` }),
      tiktok: () => ({ key: `yup.string.tiktok` }),
      adult: () => ({ key: `yup.string.adult` }),
    },
    number: {
      min: ({ min }) => ({ key: `yup.number.min`, values: { min } }),

      max: ({ max }) => ({ key: `yup.number.max`, values: { max } }),
      lessThan: ({ lessThan }) => ({ key: `yup.number.lessThan`, values: { lessThan } }),
      moreThan: ({ moreThan }) => ({ key: `yup.number.moreThan`, values: { moreThan } }),
      positive: () => ({ key: `yup.number.positive` }),
      negative: () => ({ key: `yup.number.negative` }),
      integer: () => ({ key: `yup.number.integer` }),
      truncate: () => ({ key: `yup.number.truncate` }),
      round: () => ({ key: `yup.number.round` }),
    },
    date: {
      min: ({ min }) => ({ key: `yup.date.min`, values: { min } }),
      max: ({ max }) => ({ key: `yup.date.max`, values: { max } }),
    },
    array: {
      min: ({ min }) => ({ key: `yup.array.min`, values: { min } }),
      max: ({ max }) => ({ key: `yup.array.max`, values: { max } }),
      of: () => ({ key: `yup.array.of` }),
      json: () => ({ key: `yup.array.json` }),
      length: () => ({ key: `yup.array.length` }),
      ensure: () => ({ key: `yup.array.ensure` }),
      compact: () => ({ key: `yup.array.compact` }),
    },
    object: {
      shape: () => ({ key: `yup.object.shape` }),
      json: () => ({ key: `yup.object.json` }),
      concat: () => ({ key: `yup.object.concat` }),
      pick: () => ({ key: `yup.object.pick` }),
      omit: () => ({ key: `yup.object.omit` }),
      from: () => ({ key: `yup.object.from` }),
      noUnknown: () => ({ key: `yup.object.noUnknown` }),
      camelCase: () => ({ key: `yup.object.camelCase` }),
      constantCase: () => ({ key: `yup.object.constantCase` }),
    },
  })
}

export const useYup = () => {
  initial()

  Yup.addMethod(Yup.object, 'adult', function () {
    return this.test('adult', { key: 'yup.object.adult' }, (value) => {
      const now = new Date()
      const birth = new Date(value.year, value.month - 1, value.day)

      let leafDays = Math.round((now.getFullYear() - birth.getFullYear()) / 4)
      leafDays += (value.year % 4 === 0 && value.year % 100 !== 0) || value.year % 400 === 0 ? 1 : 0
      const diff = (now.getTime() - birth.getTime()) / 1000 - leafDays * 60 * 60 * 24
      const age = diff / (60 * 60 * 24 * 365)
      return age >= 18
    })
  })

  /**
   * @description 驗證是否包含全形字，最多5個
   */
  Yup.addMethod(Yup.string, 'fullwidth', function () {
    return this.test((value) => {
      const fullCharRegex = /[\uFF01-\uFF60\uFFE0-\uFFE6\u4E00-\u9FFF]/g
      const matches = value.match(fullCharRegex) ?? []
      console.log('matches', matches)
      if (matches.length <= 5) return true
      return false
    })
  })

  /**
   * @description 驗證是否包含半形字，最多10個
   */
  Yup.addMethod(Yup.string, 'halfwidth', function () {
    return this.test((value) => {
      const regex = /[\u0020-\u007E]/g
      const matches = value.match(regex) ?? []
      console.log('matches', matches)
      if (matches.length <= 10) return true
      return false
    })
  })

  Yup.addMethod(Yup.string, 'complexPassword', function () {
    return this.test((value) => {
      // const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+]).+$/
      const regex = /^[\w!@#$%^&*()_+]*$/
      return regex.test(value)
    })
  })

  Yup.addMethod(Yup.string, 'weakPassword', function () {
    return this.matches(/^(?=.*[a-z])(?=.*[0-9])/)
  })

  Yup.addMethod(Yup.string, 'mediumPassword', function () {
    return this.min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
  })

  Yup.addMethod(Yup.string, 'strongPassword', function () {
    return this.min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)/)
  })

  Yup.addMethod(Yup.string, 'instagram', function () {
    return this.matches(/^.*www\.instagram\.com\/[._A-Za-z0-9]+$/, { message: { key: 'yup.string.instagram' } })
  })

  Yup.addMethod(Yup.string, 'twitter', function () {
    return this.matches(/^.*twitter\.com\/[_A-Za-z0-9]+$/, { message: { key: 'yup.string.twitter' } })
  })

  Yup.addMethod(Yup.string, 'tiktok', function () {
    return this.matches(/^.*www\.tiktok\.com\/[@_A-Za-z0-9]+$/, { message: { key: 'yup.string.tiktok' } })
  })

  Yup.addMethod(Yup.string, 'vida', function () {
    return this.matches(/^.*vida\.pub\/[_A-Za-z0-9\u4e00-\u9fff]+$/, {
      message: { key: 'yup.string.vida' },
    })
  })

  return Yup
}

export const parseError = (err) => {
  return err.message?.key ? $t(err.message.key, err.message.values) : err.message
}

export const validate = (schema, obj) => {
  if (!('value' in obj) || !(`error` in obj) || !(`check` in obj)) throw new Error('Object is not valid.')
  return schema
    .validate(obj.value)
    .then(() => {
      obj.error = ''
      obj.check = true
    })
    .catch((error) => {
      obj.error = parseError(error)
      obj.check = false
    })
}

export const validateSync = (schema, obj) => {
  try {
    schema.validateSync(obj.value)
    obj.check = true
    obj.error = ''
  } catch (err) {
    obj.check = false
    obj.error = parseError(err)
  }
}
