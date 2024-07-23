import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineStore } from 'pinia'
import { useLocale } from '@use/utils/locale'
import { getDecryptDataBlob } from '@/utils/encrypt-img-store'
import { locales } from '@/i18n'

export const useHeadStore = defineStore('app-head', () => {
  const { t: $t } = useI18n()
  const locale = useLocale()

  const $title = ref({
    key: 'meta.home.title',
    params: {},
  })
  const $description = ref({
    key: 'meta.home.description',
    params: {},
  })

  const parseValue = (v) => {
    if (typeof v === 'object') return $t(v.key, { ...v?.params })
    else if (typeof v === 'string') return v
    else throw new Error('Title must be an object or a string')
  }

  const titleProxy = computed(() => parseValue($title.value))
  const descriptionProxy = computed(() => parseValue($description.value))

  const metaKeyword = ref({
    items: [
      'meta.keywords.short',
      'meta.keywords.video',
      'meta.keywords.interact',
      'meta.keywords.content',
      'meta.keywords.title',
    ],
    needTranslate: true,
  })

  const keywords = computed(() => {
    console.log('Before: metaKeyword.value.items', metaKeyword.value.items)
    const result = metaKeyword.value.items
      .map((_item) => (metaKeyword.value.needTranslate ? $t(_item) : _item))
      .join(',')
    console.log('After: metaKeyword.value.items', { result, items: metaKeyword.value.items })
    return result
  })

  const ogTitle = computed(() => titleProxy.value)
  const ogDescription = computed(() => descriptionProxy.value)
  const ogUrl = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')
  const ogType = 'website'
  const ogImage = ref(ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg'))

  const twitterTitle = computed(() => titleProxy.value)
  const twitterDescription = computed(() => descriptionProxy.value)
  const twitterImage = ref(ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg'))

  const canonical = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')

  const alternates = ref([
    ...locales.map((locale) => ({
      rel: 'alternate',
      hreflang: locale.value,
      href: import.meta.env.VITE_APP_URL + `/${locale.value}`,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: import.meta.env.VITE_APP_URL + '/en',
    },
  ])

  let updateTimestamp
  function startUpdate() {
    const ts = Date.now()
    updateTimestamp = ts
    return ts
  }
  function isUpdateBreak(ts) {
    return ts !== updateTimestamp
  }

  async function setup({ title: _title, description: _description, keywords: _keywords, url: _url, image: _image }) {
    const ts = startUpdate()

    if (_title) $title.value = _title
    if (_description) $description.value = _description
    if (_keywords) metaKeyword.value = { ..._keywords }
    if (_url) ogUrl.value = `${import.meta.env.VITE_APP_URL}/${locale.value}${_url}`

    if (_image) {
      const image = await getDecryptDataBlob(_image)

      if (isUpdateBreak(ts)) {
        return
      }

      ogImage.value = image
      twitterImage.value = image
    }
  }

  function reset() {
    startUpdate()

    $title.value = { key: 'meta.home.title' }
    $description.value = { key: 'meta.home.description' }
    metaKeyword.value = {
      items: [
        'meta.keywords.short',
        'meta.keywords.video',
        'meta.keywords.interact',
        'meta.keywords.content',
        'meta.keywords.title',
      ],
      needTranslate: true,
    }
    ogUrl.value = import.meta.env.VITE_APP_URL ?? 'https://vida.pub'
    ogImage.value = ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg')
    twitterImage.value = ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg')
  }

  return {
    title: titleProxy,
    description: descriptionProxy,
    keywords,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
    alternates,
    setup,
    reset,
  }
})
