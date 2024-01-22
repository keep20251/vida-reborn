<template>
  <Page>
    <template #main-top>
      <Head :title="creator?.nickname"></Head>
    </template>
    <template #default>
      <div>{{ '這是創作者頁: ' + route.name + ' - ' + route.params.username }}</div>
      <div v-if="creator" class="whitespace-pre">
        {{
          Object.entries(creator)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')
        }}
      </div>
      <Loading v-else></Loading>
    </template>
  </Page>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useCreatorStore } from '@/store/creator'
import { useHydrationStore } from '@/store/hydration'
import { onServerClientOnce, onHydration } from '@use/lifecycle'
import Head from '@comp/navigation/Head.vue'

const route = useRoute()

const creatorStore = useCreatorStore()
const { getCreator, revertCreator } = creatorStore

const creator = ref(null)

onActivated(async () => {
  const username = route.params.username
  if (username !== creator.value?.username) {
    creator.value = null
    creator.value = await getCreator(username)
  }
})

// hydration
const hydrationStore = useHydrationStore()
const { creator: creatorFromStore } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  creator.value = await getCreator(route.params.username)
  if (isSSR) {
    creatorFromStore.value = creator.value
  }
})
onHydration(() => {
  creator.value = revertCreator(creatorFromStore.value)
})
</script>
