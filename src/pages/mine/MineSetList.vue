<template>
  <div class="px-20">
    <div class="flex flex-col space-y-20">
      <div class="relative flex items-center justify-center border-b">
        <div class="absolute left-0 flex">
          <Icon class="-rotate-90" name="back" size="20"></Icon>
        </div>
        <div class="py-20">{{ $t('title.mine') }}</div>
      </div>
      <div class="flex flex-row space-x-10">
        <Avatar :src="userData.thumb" :radius="35"></Avatar>
        <div class="flex flex-col justify-center space-y-5">
          <div class="text-lg font-bold leading-lg">{{ userData.nickname }}</div>
          <div class="text-sm font-normal leading-3">@{{ userData.username }}</div>
          <div class="text-sm font-normal leading-3">{{ userData.view_count }} {{ $t('content.view') }}</div>
        </div>
      </div>
      <Link href="/mine/main">
        <Button @click="to('mine-main')">{{ $t('common.editPersonalPage') }}</Button>
      </Link>
      <SetList></SetList>
    </div>
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

const { userData } = storeToRefs(useAccountStore())
const { to } = useRouters()
</script>
