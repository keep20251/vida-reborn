import { shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { http } from '@/http'

/**
 * 取得本地語言包
 * @param {string} name 內層資料夾名稱
 * @param {string} folder 外層資料夾名稱
 * @param {type} initValue 初始化的值
 * @returns
 */
export function useI18nPack(name, folder = 'about', initValue = {}) {
  if (!name) {
    throw new Error(`name param ${name} error...`)
  }

  const { locale } = storeToRefs(useI18n())
  const i18n = shallowRef(initValue)
  watch(
    locale,
    async (newLocale, prevLocale, onCleanup) => {
      let cleanup = false
      onCleanup(() => (cleanup = true))

      const langPack = await http('GET', `${folder}/${name}/${newLocale}.json`, null, { baseURL: '/' })
      if (!cleanup) {
        i18n.value = langPack
      }
    },
    { immediate: true },
  )

  return i18n
}
