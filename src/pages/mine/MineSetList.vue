<template>
  <div class="flex flex-col space-y-20 border-t">
    <div v-if="isUser || isCreator" class="flex flex-row space-x-10 pt-20">
      <Avatar :src="userData.thumb" :radius="35"></Avatar>
      <div class="flex flex-col justify-center space-y-5">
        <div class="max-w-[15rem] overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-lg">
          {{ userData.nickname }}
        </div>
        <div class="text-sm font-normal leading-3">@{{ userData.username }}</div>
        <div v-if="isCreator" class="text-sm font-normal leading-3">
          {{ userData.subscriber_count }} {{ $t('common.subscribe') }}
        </div>
      </div>
    </div>
    <Link v-if="isCreator" href="/mine/main">
      <Button @click="to('mine-main')">{{ $t('common.editPersonalPage') }}</Button>
    </Link>
    <SetList></SetList>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import Button from '@comp/common/Button.vue'
import Link from '@comp/common/Link.vue'
import SetList from '@comp/mine/SetList.vue'
import Avatar from '@comp/multimedia/Avatar.vue'
import { useRouters } from '@use/routers'

const { userData, isCreator, isUser } = storeToRefs(useAccountStore())
const { to } = useRouters()
</script>
