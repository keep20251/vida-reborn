<template>
  <div>
    <SelfIntro :item="userData" show-bg-data show-personal-Info show-all-info>
      <template #topButton>
        <div class="flex items-center space-x-10">
          <Icon class="cursor-pointer" name="link" size="20"></Icon>
          <Icon class="cursor-pointer" name="moreHorizontal" size="20"></Icon>
          <div v-if="isPrvwActive === 'isVisitor'">
            <Button class="!h-26 !px-20 !py-6">{{ $t('common.subscribe') }}</Button>
          </div>
        </div>
      </template>
      <template #middleButton v-if="isPrvwActive === 'isVisitor'">
        <div class="cursor-pointer text-sm font-bold leading-3 underline underline-offset-2">
          {{ $t('common.viewSubscribePlan') }}
        </div>
      </template>
    </SelfIntro>
    <div class="mt-20 flex h-36 w-full items-center bg-gray-f6 px-20 text-base font-bold leading-md">
      {{ $t('content.allPosts') }} 85
    </div>
    <div class="overflow-x-hidden">
      <List :items="items" item-key="id">
        <template #default="{ last }">
          <Feed class="py-20"></Feed>
          <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
        </template>
        <template #bottom>
          <div class="flex items-center justify-center py-8 text-gray-a3">
            <Loading></Loading> {{ $t('common.loading') }}
          </div>
        </template>
      </List>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import SelfIntro from '@comp/main/SelfIntro.vue'

const mineStore = useMineStore()
const { isPrvwActive } = storeToRefs(mineStore)

const { userData } = storeToRefs(useAccountStore())

const items = ref([])
</script>
