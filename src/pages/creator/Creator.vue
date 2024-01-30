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
      <div v-else-if="error">{{ error }}</div>
      <Loading v-else></Loading>
    </template>
  </Page>
</template>

<script setup>
import { onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCreatorStore } from '@/store/creator'
import { useHydrationStore } from '@/store/hydration'
import Head from '@comp/navigation/Head.vue'
import { onHydration, onServerClientOnce } from '@use/lifecycle'

const route = useRoute()

const creatorStore = useCreatorStore()
const { get: $getCreator, revert: revertCreator } = creatorStore

const creator = ref(null)
const error = ref('')
async function getCreator() {
  creator.value = null
  try {
    creator.value = await $getCreator(route.params.username)
  } catch (e) {
    error.value = e.message
  }
}

onActivated(async () => {
  if (route.params.username !== creator.value?.username) {
    creator.value = null
    await getCreator()
  }
})

// hydration
const hydrationStore = useHydrationStore()
const { creator: creatorFromStore, creatorError } = storeToRefs(hydrationStore)
onServerClientOnce(async (isSSR) => {
  await getCreator()

  if (isSSR) {
    creatorFromStore.value = creator.value
    creatorError.value = error.value
  }
})
onHydration(() => {
  creator.value = revertCreator(creatorFromStore.value)
  error.value = creatorError.value
})
</script>
