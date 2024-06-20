<template>
  <div class="flex flex-col space-y-20">
    <div class="flex flex-col space-y-10">
      <label class="text-left text-base font-normal not-italic leading-md">{{ $t('label.reportReason') }}</label>
      <div class="flex flex-col space-y-2">
        <Dropdown v-model="reason" :options="reasons" inset></Dropdown>
      </div>
    </div>
    <TextareaWrap v-model="desc" :label="$t('label.reportDesc')" :errMsg="descErrMsg" :line="6" leading></TextareaWrap>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from '@comp/form/Dropdown.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import { useConfirmData } from '@use/modal/confirm-data'
import useRequest from '@use/request'

const { t: $t } = useI18n()

const reason = ref(null)
const reasons = ref([])

const desc = ref('')
const descErrMsg = ref('')

useConfirmData(validator)

async function validator() {
  // 驗證資料沒通過回傳 fasle
  if (desc.value === '') {
    descErrMsg.value = $t('yup.mixed.required')
    return false
  }

  // 驗證資料通過打包成想回傳的樣子回傳
  const data = { type: reason.value, reason: desc.value }

  // 重置資料內容
  reset()

  return data
}

function reset() {
  reason.value = 0
  desc.value = ''
  descErrMsg.value = ''
}

const { execute } = useRequest('User.listReportReasons')
onMounted(() => {
  execute().then((d) => {
    reasons.value = d.map((v, i) => ({ label: v, value: i }))
    reason.value = 0
  })
})
</script>
