<template>
  <div class="flex justify-end pt-20">
    <ButtonTab v-model="tabBtn" :options="tabBtnOptions"></ButtonTab>
  </div>
  <List :items="items" item-key="status" divider>
    <template #default="{ item }">
      <div class="py-15 text-base font-bold">#{{ status(item) }}</div>
      <List :items="item.list" item-key="id" divider>
        <template #default="{ item }">
          <Feed class="py-10" :item="item" :show-auto-publish-time="tab === TAB_TYPE.SCH"></Feed>
          <Button class="mb-20" @click="onEdit(item)">{{ $t('label.edit') }}</Button>
        </template>
      </List>
    </template>
    <template #bottom>
      <div class="flex items-center justify-center py-8 text-gray-a3">
        <Loading v-if="isLoading"></Loading>
        <span v-if="noMore">{{ $t('common.noMore') }}</span>
      </div>
    </template>
  </List>
</template>
<script setup>
import { computed, onActivated, onDeactivated, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'
import { usePublishStore } from '@/store/publish'
import Button from '@comp/common/Button.vue'
import Feed from '@comp/main/Feed.vue'
import ButtonTab from '@comp/navigation/ButtonTab.vue'
import { useInfinite } from '@use/request/infinite'
import { useRouters } from '@use/routers'
import { POST_TAB_TYPE as TAB_TYPE } from '@const/mine'
import { FEED_PERM, FEED_STATUS, MEDIA_TYPE } from '@const/publish'
import { commaSplittedToArray } from '@/utils/string-helper'

const route = useRoute()
const { to, updateParams } = useRouters()

const mineStore = useMineStore()
const { postReloadFlag } = storeToRefs(mineStore)
const { setTab, clearTab, setNextFn, clearNextFn, setReloadFn, clearReloadFn } = mineStore

const tab = ref(checkRouteTab() ? route.query.t : TAB_TYPE.SUB)
const tabOptions = [
  { label: 'common.subscribe', value: TAB_TYPE.SUB },
  { label: 'label.sale', value: TAB_TYPE.BUY },
  { label: 'label.scheduledRelease', value: TAB_TYPE.SCH },
  { label: 'label.private', value: TAB_TYPE.PRI },
]
watch(tab, (t) => updateParams({ query: { t } }), { immediate: true })
whenever(
  () => route.query.t && route.name === 'mine-post' && checkRouteTab(),
  () => (tab.value = route.query.t),
)
function checkRouteTab() {
  return [TAB_TYPE.SUB, TAB_TYPE.BUY, TAB_TYPE.SCH, TAB_TYPE.PRI].includes(route.query.t)
}

const tabBtnValues = reactive({
  [TAB_TYPE.SUB]: MEDIA_TYPE.ALL,
  [TAB_TYPE.BUY]: MEDIA_TYPE.ALL,
  [TAB_TYPE.SCH]: MEDIA_TYPE.ALL,
  [TAB_TYPE.PRI]: MEDIA_TYPE.ALL,
})
const tabBtn = computed({
  get: () => tabBtnValues[tab.value],
  set: (v) => (tabBtnValues[tab.value] = v),
})
const tabBtnOptions = ref([
  { label: 'label.all', value: MEDIA_TYPE.ALL },
  { label: 'info.image', value: MEDIA_TYPE.IMAGE },
  { label: 'info.video', value: MEDIA_TYPE.VIDEO },
])

const pages = {
  // 訂閱
  [`${TAB_TYPE.SUB}${MEDIA_TYPE.ALL}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SUB, pre_display: 0, resource_type: MEDIA_TYPE.ALL },
    }),
  },
  [`${TAB_TYPE.SUB}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SUB, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.SUB}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SUB, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },

  // 販售
  [`${TAB_TYPE.BUY}${MEDIA_TYPE.ALL}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.BUY, pre_display: 0, resource_type: MEDIA_TYPE.ALL },
    }),
  },
  [`${TAB_TYPE.BUY}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.BUY, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.BUY}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.BUY, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },

  // 定時發布
  [`${TAB_TYPE.SCH}${MEDIA_TYPE.ALL}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SCH, pre_display: 1, resource_type: MEDIA_TYPE.ALL },
    }),
  },
  [`${TAB_TYPE.SCH}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SCH, pre_display: 1, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.SCH}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.SCH, pre_display: 1, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },

  // 僅限自己
  [`${TAB_TYPE.PRI}${MEDIA_TYPE.ALL}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.PRI, pre_display: 0, resource_type: MEDIA_TYPE.ALL },
    }),
  },
  [`${TAB_TYPE.PRI}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.PRI, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.PRI}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: FEED_PERM.PRI, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },
}
const items = computed(() => {
  const datas = pages[`${tab.value}${tabBtn.value}`].infinite.dataList.value.slice()

  // 先排序
  // 順序為 REJECT(5) > REVIEW(1) > PASS(3) > PUBLISHED(2)
  // 所以 REVIEW 直接改成 4 剛好就是對應大小
  datas.sort((a, b) => {
    const av = a.status === FEED_STATUS.REVIEW ? 4 : a.status
    const bv = b.status === FEED_STATUS.REVIEW ? 4 : b.status
    return bv - av
  })

  // 再分群
  // [{ status: 5, list: []},{ status: 1, list: []}, { status: 3, list: []}, { status: 2, list: []}, ]
  return datas.reduce((a, d) => {
    if (a.length === 0 || a[a.length - 1].status !== d.status) {
      a.push({ status: d.status, list: [d] })
    } else {
      a[a.length - 1].list.push(d)
    }
    return a
  }, [])
})
const isLoading = computed(() => pages[`${tab.value}${tabBtn.value}`].infinite.isLoading.value)
const noMore = computed(() => pages[`${tab.value}${tabBtn.value}`].infinite.noMore.value)
watch(
  [tab, tabBtn],
  ([tab, tabBtn]) => {
    const page = pages[`${tab}${tabBtn}`]
    if (!page.inited) {
      page.inited = true
      page.infinite.init()
    }
    setNextFn(page.infinite.next)
    setReloadFn(page.infinite.reload)
  },
  { immediate: true },
)
onActivated(() => {
  setNextFn(pages[`${tab.value}${tabBtn.value}`].infinite.next)
  setReloadFn(pages[`${tab.value}${tabBtn.value}`].infinite.reload)
  setTab(tab, tabOptions)
})
onDeactivated(() => {
  clearNextFn()
  clearReloadFn()
  clearTab()
})
watch(postReloadFlag, () => pages[`${tab.value}${tabBtn.value}`].infinite.reload())

const { t: $t } = useI18n()
function status(item) {
  if (item.status === FEED_STATUS.REVIEW) return $t('info.underReview')
  if (item.status === FEED_STATUS.REJECT) return $t('info.reviewFail')
  if (item.status === FEED_STATUS.PASS) return $t('info.reviewPass')
  if (item.status === FEED_STATUS.PUBLISHED) return $t('info.published')
}

const publishStore = usePublishStore()
const { toUpdate } = publishStore
function onEdit(item) {
  toUpdate({
    id: item.id,
    category: item.category + '',
    title: item.title,
    content: item.content,
    tags: commaSplittedToArray(item.tags),
    type: item.resource_type,
    perm: item.article_type,
    subs: item.user.subscription_list.map((sub) => sub.id),
    price: item.price,
    postTime: new Date(item.display_ts * 1000),
    urls: item.url,
  })

  to('publish')
}
</script>
