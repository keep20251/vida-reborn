<template>
  <div
    v-if="show"
    class="fixed bottom-0 left-0 right-0 z-50 cursor-pointer bg-purple-600 px-20 py-15 text-center text-white"
    @click="handleClick"
  >
    <div class="text-sm font-normal leading-4">
      尽快点击前往
      <span class="text-orange-400 underline hover:text-orange-300">注册</span>
      或
      <span class="text-orange-400 underline hover:text-orange-300">登录</span>
      ，避免购买资料遗失
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useBottomPromptStore } from '@/store/bottom-prompt'

const bottomPromptStore = useBottomPromptStore()
const { show } = storeToRefs(bottomPromptStore)
const { hidePrompt } = bottomPromptStore

const { openAuthDialog } = useAccountStore()

const handleClick = () => {
  openAuthDialog()
  hidePrompt()
}
</script>
