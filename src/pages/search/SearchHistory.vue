<template>
  <div class="w-full">
    <div class="flex flex-col space-y-20">
      <Client-Only>
        <div v-if="historyTags.length > 0" class="flex flex-col space-y-10">
          <div class="flex justify-between text-base font-normal leading-md">
            <div>{{ $t('title.search.history') }}</div>
            <div class="cursor-pointer" @click="openClearConfirm">
              {{ $t('title.search.popular') }}
            </div>
          </div>
          <TagGroup
            v-model="selectedHistory"
            :items="historyTags"
            @update:modelValue="(q) => to('search', { query: { q } })"
          ></TagGroup>
        </div>
      </Client-Only>
      <div class="flex flex-col space-y-10">
        <div class="text-base font-normal leading-md">{{ $t('title.search.clear') }}</div>
        <TagGroup
          v-model="selectedPopular"
          :items="popularTags"
          @update:modelValue="(q) => to('search', { query: { q } })"
        ></TagGroup>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useHydrationStore } from '@/store/hydration'
import { useModalStore } from '@/store/modal'
import { useSearchStore } from '@/store/search'
import TagGroup from '@comp/common/TagGroup.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'
import { useRouters } from '@/compositions/routers'

const { to } = useRouters()

const searchStore = useSearchStore()
const { fetchPopularTags, clearHistoryTags } = searchStore
const { popularTags, historyTags } = storeToRefs(searchStore)

const selectedHistory = ref('')
const selectedPopular = ref('')

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
const { t: $t } = useI18n()
function openClearConfirm() {
  confirm({
    size: 'sm',
    title: 'title.clearSearchHistory',
    content: $t('content.clearSearchHistory'),
    confirmAction: clearHistoryTags,
  })
}
</script>
