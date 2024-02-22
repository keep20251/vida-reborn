<template>
  <div>
    <div class="flex pt-8">
      <div class="text-base font-bold leading-md">{{ $t('content.currentEarn') }}</div>
    </div>
    <div class="flex items-end justify-center space-x-5 py-35">
      <div class="text-base font-bold leading-md">$</div>
      <div class="text-xl font-bold leading-xl">{{ overallData?.total_income || 0 }}</div>
    </div>
    <InputWrap
      v-model="credential.wdrlAmount.value"
      :label="$t('label.wdrlAmount')"
      :placeholder="$t('placeholder.wdrlAmount')"
      :errMsg="credential.wdrlAmount.error"
    ></InputWrap>
    <ol class="!list-decimal pb-20 pl-20 pt-10 text-base font-normal leading-xl text-gray-a3">
      <li>{{ $t('content.wdrlAtLeast') }}</li>
      <li>{{ $t('content.wdrlNotMoreNumNow') }}</li>
      <li>{{ $t('content.wdrlReview') }}</li>
    </ol>
    <Button @click="submit">{{ $t('content.withdrawalApply') }}</Button>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useEarnStore } from '@/store/earn'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request'
import { useYup } from '@use/validator/yup.js'

const { confirm } = useModalStore()
const earnStore = useEarnStore()
const { refreshOverallData } = earnStore
const { overallData } = storeToRefs(earnStore)

onMounted(() => {
  refreshOverallData()
})

const { t: $t } = useI18n()
const { Yup, validate } = useYup()
const { number } = Yup
const credential = reactive({
  wdrlAmount: {
    value: '',
    error: '',
    check: false,
    schema: number().required($t('yup.mixed.required')).positive().min(100).typeError($t('yup.number.positive')),
  },
})

async function submit() {
  await validate(credential.wdrlAmount.schema, credential.wdrlAmount)
  confirm({
    size: 'sm',
    title: $t('beCreator.title.reConfirm'),
    content: ($t('modal.confirmAmount'), { price: credential.wdrlAmount.value }),
    confirmAction: () => {
      onWithdraw()
    },
  })
}

const onWithdraw = async () => {
  try {
    await useRequest('User.applyWithdraw', { params: { amount: credential.wdrlAmount.value }, immediate: true })
    refreshOverallData()
  } catch (e) {
    alert({
      title: 'title.publishFail',
      content: e.message,
    })
  }
}
</script>
