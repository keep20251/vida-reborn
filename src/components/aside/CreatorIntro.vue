<template>
  <div v-if="creator">
    <div class="flex">
      <Avatar class="mr-10" :radius="35" :src="creator.thumb"></Avatar>
      <div class="flex flex-col justify-center space-y-10">
        <div class="flex items-end space-y-4">
          <div class="max-w-[6.25rem] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-lg">
            {{ creator.nickname }}
          </div>
          <div
            class="max-w-[6.25rem] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-3 text-gray-57"
          >
            ＠{{ creator.username }}
          </div>
        </div>
        <div class="flex">
          <div class="text-sm font-normal leading-3 text-gray-57">{{ creator.post_num }} {{ $t('content.posts') }}</div>
          <div class="mx-2 text-sm font-normal leading-3 text-gray-57">•</div>
          <div class="text-sm font-normal leading-3 text-gray-57">
            {{ creator.view_count }} {{ $t('content.view') }}
          </div>
        </div>
      </div>
    </div>
    <div class="mb-20 mt-10 text-base leading-lg">{{ creator.description }}</div>
    <Button @click="open({ items: creator?.subscription_list, creator })">{{ $t('common.viewSubscribePlan') }}</Button>
  </div>
  <Loading v-else></Loading>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCreatorStore } from '@/store/creator'
import { useSubsciptionStore } from '@/store/subscription'
import Button from '@comp/common/Button.vue'
import Avatar from '@comp/multimedia/Avatar.vue'

const props = defineProps({
  username: { type: String, required: true },
})

const creator = ref(null)
const creatorStore = useCreatorStore()
const { get: getCreator } = creatorStore

const { open } = useSubsciptionStore()

watch(
  () => props.username,
  async (v, _, onCleanup) => {
    let cleanup = false
    onCleanup(() => (cleanup = true))

    creator.value = null

    try {
      const newCreator = await getCreator(v)

      if (cleanup) {
        return
      }
      creator.value = newCreator
    } catch (e) {
      console.error(e)
    }
  },
  { immediate: true },
)
</script>
