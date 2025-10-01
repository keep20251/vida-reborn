<template>
  <div v-if="showWelcome" class="text-xl font-bold mb-30 mt-30">
    <p>👋 歡迎！</p>
    <p class="mt-20">立即前往第一個創作者的頻道吧</p>
  </div>
  <div class="rounded-lg border-[0.5px] border-[#B2B2B2] p-30">
    <h3 class="text-center text-[14px] font-bold">前往創作者頻道</h3>
    <div class="mb-20 mt-30 flex items-center text-[14px]">
      <label for="creatorId">創作者 @ID 號碼</label>
      <button class="ml-auto text-[#6567E8]" @click="handleScanCode">掃碼</button>
    </div>
    <InputWrap
      v-model="creatorId"
      id="creatorId"
      :placeholder="$t('placeholder.enterCreatorId')"
      @keypress.enter="goToCreator"
    ></InputWrap>
    <Button size="lg" class="w-full mt-20" @click="goToCreator">{{$t('common.goNow')}}</Button>
  </div>
  <div v-if="bottom" class="text-center mt-30">
    <p class="text-[#575757] underline">我是創作者</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import { useRouters } from '@/compositions/routers'

defineProps({
  showWelcome: { type: Boolean, default: true },
  showBottom: { type: Boolean, default: true },
})

const { t: $t } = useI18n()
const creatorId = ref('')
const { toCreator } = useRouters()

function goToCreator() {
  if (creatorId.value.trim()) {
    // 移除可能的 '@' 符号前缀
    const username = creatorId.value.trim().replace(/^@/, '')
    toCreator(username)
  }
}

function handleScanCode() {
  // 实现扫码功能
  console.log('扫描二维码功能')
}
</script>
