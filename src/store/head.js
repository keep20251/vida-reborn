import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineStore } from 'pinia'
import { useLocale } from '@use/utils/locale'
import { getDecryptDataBlob } from '@/utils/encrypt-img-store'
import { locales } from '@/i18n'

export const useHeadStore = defineStore('app-head', () => {
  const { t: $t } = useI18n()
  const locale = useLocale()

  const $title = ref({ key: 'meta.home.title' })
  const titleProxy = computed(() => parseValue($title.value))

  const $description = ref({ key: 'meta.home.description' })
  const descriptionProxy = computed(() => parseValue($description.value))

  const $keyword = ref({ key: 'meta.home.keywords' })
  const keywordProxy = computed(() => parseValue($keyword.value))

  const author = ref(null)
  const publishTime = ref(null)
  const tags = ref(null)

  function parseValue(v) {
    if (typeof v === 'object') return $t(v.key, { ...v?.params })
    else if (typeof v === 'string') return v
    else throw new Error('Title must be an object or a string')
  }

  const ogTitle = computed(() => titleProxy.value)
  const ogDescription = computed(() => descriptionProxy.value)
  const ogUrl = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')
  const ogType = ref('website')
  const ogImage = ref(ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg'))

  const twitterTitle = computed(() => titleProxy.value)
  const twitterDescription = computed(() => descriptionProxy.value)
  const twitterImage = ref(ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg'))

  const canonical = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')

  const $jsonld = ref({})
  const jsonldSchema = computed(() => JSON.stringify($jsonld.value))

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

  async function setup({
    title: _title,
    description: _description,
    keywords: _keyword,
    author: _author = null,
    type: _type = 'website',
    publishTime: _publishTime = null,
    tags: _tags = null,
    url: _url,
    image: _image,
    jsonld: _jsonLd,
  }) {
    const ts = startUpdate()

    if (_title) $title.value = _title
    if (_description) $description.value = _description
    if (_keyword) $keyword.value = _keyword
    if (_url) {
      const newUrl = `${import.meta.env.VITE_APP_URL}/${locale.value}${_url}`
      ogUrl.value = newUrl
      canonical.value = newUrl
    }

    author.value = _author
    publishTime.value = _publishTime
    tags.value = _tags
    ogType.value = _type

    /**
     * Do not execute Jsonld schema translation before other meta tags.
     * Because our jsonld resource from the backend could be wrong.
     * It will break all execution down...🤪
     */
    $jsonld.value = _jsonLd

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
    $keyword.value = { key: 'meta.home.keywords' }

    author.value = null
    publishTime.value = null
    tags.value = null
    $jsonld.value = {}

    ogType.value = 'website'
    ogUrl.value = import.meta.env.VITE_APP_URL ?? 'https://vida.pub'
    ogImage.value = ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg')
    twitterImage.value = ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg')

    canonical.value = import.meta.env.VITE_APP_URL ?? 'https://vida.pub'
  }

  return {
    title: titleProxy,
    description: descriptionProxy,
    keywords: keywordProxy,
    author,
    publishTime,
    tags,
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
    jsonldSchema,
    setup,
    reset,
  }
})
