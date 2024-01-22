import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { locales } from '@/i18n'
import { useI18n } from 'vue-i18n'

export const useHeadStore = defineStore('app-head', () => {
  const { t: $t } = useI18n()

  const title = ref($t('meta.home.title', { pipe: '|' }))
  const description = ref($t('meta.home.description'))

  const keywordArr = ref([
    $t('meta.keywords.short'),
    $t('meta.keywords.video'),
    $t('meta.keywords.interact'),
    $t('meta.keywords.content'),
    $t('meta.keywords.title'),
  ])
  const keywords = computed(() => keywordArr.value.join(', '))

  const ogTitle = computed(() => title.value)
  const ogDescription = computed(() => description.value)
  const ogUrl = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')
  const ogType = 'website'
  const ogImage = ref(ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg'))

  const twitterTitle = computed(() => title.value)
  const twitterDescription = computed(() => description.value)
  const twitterImage = ref(ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg'))

  const canonical = ref(import.meta.env.VITE_APP_URL ?? 'https://vida.pub')

  const alternates = ref([
    ...locales.map((locale) => ({
      rel: 'alternate',
      hreflang: locale.label,
      href: import.meta.env.VITE_APP_URL + `/${locale.label}`,
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: import.meta.env.VITE_APP_URL + '/en',
    },
  ])

  function reset() {
    title.value = $t('meta.home.title', { pipe: '|' })
    description.value = $t('meta.home.description')
    keywordArr.value = [
      $t('meta.keywords.short'),
      $t('meta.keywords.video'),
      $t('meta.keywords.interact'),
      $t('meta.keywords.content'),
      $t('meta.keywords.title'),
    ]
    ogUrl.value = import.meta.env.VITE_APP_URL ?? 'https://vida.pub'
    ogImage.value = ogUrl.value + (import.meta.env.VITE_APP_OG_IMAGE ?? '/seo/og-image.jpg')
    twitterImage.value = ogUrl.value + (import.meta.env.VITE_APP_TWITTER_IMAGE ?? '/seo/twitter-image.jpg')
  }

  return {
    title,
    description,
    keywordArr,
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
    reset,
  }
})
