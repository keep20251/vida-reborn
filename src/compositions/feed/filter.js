import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHOICE } from '@/constant'
import { ARTICLE_FILTER } from '@/constant/article'

/**
 * @param {Object} param0
 * @param {Ref<Array>} param0.subscriptions
 * @param {Ref<String>} param0.uuidRef
 * @param {Function} param0.loadAction
 * @returns
 */
export function useFeedFilter({ subscriptions }) {
  const { t: $t } = useI18n()

  const filter = ref(ARTICLE_FILTER.ALL)
  const filterOptions = computed(() => {
    const options = [
      {
        id: ARTICLE_FILTER.ALL,
        label: $t('label.all'),
        payload: {
          filter_by: ARTICLE_FILTER.ALL,
          include_my_article: CHOICE.YES,
        },
      },
    ]
    const subs =
      subscriptions.value.map((el) => ({
        id: el.id,
        label: el.name,
        payload: {
          filter_by: ARTICLE_FILTER.ALL,
          include_my_article: CHOICE.YES,
          subscription_id: el.id,
        },
      })) ?? []

    const videoOption = {
      id: ARTICLE_FILTER.VIDEO,
      label: $t('info.video'),
      payload: {
        filter_by: ARTICLE_FILTER.VIDEO,
        include_my_article: CHOICE.YES,
      },
    }

    const photo = {
      id: ARTICLE_FILTER.IMAGE,
      label: $t('info.image'),
      payload: {
        filter_by: ARTICLE_FILTER.IMAGE,
        include_my_article: CHOICE.YES,
      },
    }
    return options.concat(subs, [videoOption, photo])
  })

  const payload = computed(() => filterOptions.value.find((el) => el.id === filter.value).payload)

  return { filter, filterOptions, payload }
}
