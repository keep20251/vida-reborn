<template>
  <div class="sticky top-52 z-10 h-35 bg-white">
    <Tab v-model="tab" :options="tabOptions"></Tab>
  </div>
  <div>
    <div class="flex justify-end pt-20">
      <ButtonTab v-model="tabBtn" :options="tabBtnOptions"></ButtonTab>
    </div>
    <List :items="items" item-key="id" divider>
      <template #default="{ item }">
        <div class="py-20 text-base font-bold">#{{ status(item) }}</div>
        <Feed class="pb-10" :item="item"></Feed>
        <Button class="mb-20" @click="onEdit(item)">{{ $t('label.edit') }}</Button>
      </template>
      <template #bottom>
        <div class="flex items-center justify-center py-8 text-gray-a3">
          <Loading v-if="isLoading"></Loading>
          <span v-if="noMore">{{ $t('common.noMore') }}</span>
        </div>
      </template>
    </List>
  </div>
</template>
<script setup>
import { computed, onActivated, onDeactivated, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'
import { usePublishStore } from '@/store/publish'
import Button from '@comp/common/Button.vue'
import Feed from '@comp/main/Feed.vue'
import ButtonTab from '@comp/navigation/ButtonTab.vue'
import Tab from '@comp/navigation/Tab.vue'
import { useInfinite } from '@use/request/infinite'
import { useRouters } from '@use/routers'
import { FEED_STATUS, MEDIA_TYPE } from '@const/publish'
import { toDate } from '@/utils/string-helper'

const mineStore = useMineStore()
const { postReloadFlag } = storeToRefs(mineStore)
const { setNextFn, clearNextFn } = mineStore

const TAB_TYPE = { SUB: 1, BUY: 2, SCH: 3, PRI: 4 }

const tab = ref(TAB_TYPE.SUB)
const tabOptions = ref([
  { label: 'common.subscribe', value: TAB_TYPE.SUB },
  { label: 'label.sale', value: TAB_TYPE.BUY },
  { label: 'label.scheduledRelease', value: TAB_TYPE.SCH },
  { label: 'label.private', value: TAB_TYPE.PRI },
])

const tabBtnValues = reactive({
  [TAB_TYPE.SUB]: MEDIA_TYPE.IMAGE,
  [TAB_TYPE.BUY]: MEDIA_TYPE.IMAGE,
  [TAB_TYPE.SCH]: MEDIA_TYPE.IMAGE,
  [TAB_TYPE.PRI]: MEDIA_TYPE.IMAGE,
})
const tabBtn = computed({
  get() {
    return tabBtnValues[tab.value]
  },
  set(v) {
    tabBtnValues[tab.value] = v
  },
})
const tabBtnOptions = ref([
  { label: 'info.image', value: MEDIA_TYPE.IMAGE },
  { label: 'info.video', value: MEDIA_TYPE.VIDEO },
])

const pages = {
  [`${TAB_TYPE.SUB}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 1, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.SUB}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 1, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },
  [`${TAB_TYPE.BUY}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 2, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.BUY}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 2, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },
  [`${TAB_TYPE.SCH}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 0, pre_display: 1, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.SCH}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 0, pre_display: 1, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },
  [`${TAB_TYPE.PRI}${MEDIA_TYPE.IMAGE}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 3, pre_display: 0, resource_type: MEDIA_TYPE.IMAGE },
    }),
  },
  [`${TAB_TYPE.PRI}${MEDIA_TYPE.VIDEO}`]: {
    inited: false,
    infinite: useInfinite('Article.listManagement', {
      params: { article_type: 3, pre_display: 0, resource_type: MEDIA_TYPE.VIDEO },
    }),
  },
}
const items = computed(() => pages[`${tab.value}${tabBtn.value}`].infinite.dataList.value)
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
  },
  { immediate: true },
)
onActivated(() => setNextFn(pages[`${tab.value}${tabBtn.value}`].infinite.next))
onDeactivated(() => clearNextFn(pages[`${tab.value}${tabBtn.value}`].infinite.next))
watch(postReloadFlag, () => pages[`${tab.value}${tabBtn.value}`].infinite.reload())

const { t: $t } = useI18n()
function status(item) {
  if (item.status === FEED_STATUS.REVIEW) return $t('info.underReview')
  if (item.status === FEED_STATUS.REJECT) return $t('info.auditFailure')
  if (item.status === FEED_STATUS.PASS) return $t('info.scheduledRelease')
  if (item.status === FEED_STATUS.PUBLISHED) return $t('info.published')
}

const { to } = useRouters()
const publishStore = usePublishStore()
const { toUpdate } = publishStore
function onEdit(item) {
  toUpdate({
    id: item.id,
    category: item.category + '',
    title: item.title,
    content: item.content,
    tags: item.tags,
    type: item.resource_type,
    perm: item.article_type,
    subs: item.user.subscription_list.map((sub) => sub.id),
    price: item.price,
    postTime: toDate(item.display_at),
    urls: item.url,
  })

  to('publish')
}
</script>
