<template>
  <div class="w-full">
    <div class="flex flex-col space-y-20">
      <div class="flex flex-col space-y-10">
        <div class="flex justify-between text-base font-normal leading-md">
          <div>{{ $t('title.search.history') }}</div>
          <div class="cursor-pointer" @click="openClearConfirm">{{ $t('title.search.clear') }}</div>
        </div>
        <ClientOnly>
          <TagGroup v-model="selectedHistory" :items="historyTags" @update:modelValue="onSearch"></TagGroup>
        </ClientOnly>
      </div>
      <div class="flex flex-col space-y-10">
        <div class="text-base font-normal leading-md">{{ $t('title.search.popular') }}</div>
        <TagGroup v-model="selectedPopular" :items="popularTags" @update:modelValue="onSearch"></TagGroup>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useModalStore } from '@/store/modal'
import { useSearchStore } from '@/store/search'
import TagGroup from '@comp/common/TagGroup.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'

const searchStore = useSearchStore()
const { fetchPopularTags, clearHistoryTags, onSearch } = searchStore
const { popularTags, historyTags } = storeToRefs(searchStore)

const selectedHistory = ref('')
const selectedPopular = ref('')

onMounted(async () => await getPopularTags())
onActivated(async () => await getPopularTags())

async function getPopularTags() {
  if (popularTags.value.length <= 0) await fetchPopularTags()
}

const { popularTags: hydrationPopularTags } = storeToRefs(useHydrationStore())

onServerClientOnce(async (isSSR) => {
  await fetchPopularTags()
  if (isSSR) {
    hydrationPopularTags.value = popularTags.value
  }
})
onHydration(() => {
  popularTags.value = hydrationPopularTags.value
})

const { confirm } = useModalStore()
function openClearConfirm() {
  confirm({
    size: 'sm',
    title: 'title.clearSearchHistory',
    content: 'content.clearSearchHistory',
    confirmAction: clearHistoryTags,
  })
}
</script>
