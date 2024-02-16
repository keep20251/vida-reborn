<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative text-center py-30 rounded-t-xl">
      <div class="absolute left-0 top-1/3 pl-20 pt-4">
        <button @click="back" :history="history" :show-back="showBack">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">{{ addSubPlan ? '新增' : '編輯' }}訂閱設定</div>
      <button v-if="!addSubPlan" @click="delSubPlan" class="absolute right-0 pr-20 top-1/3 pt-4">
        <Icon name="bin"></Icon>
      </button>
    </div>
    <div class="px-25 overflow-y-scroll scrollbar-md mr-15 max-h-[65vh]">
      <div class="flex flex-col space-y-10">
        <div class="flex flex-row items-start space-x-5">
          <div class="text-base leading-md font-normal">訂閱樣式</div>
          <div class="text-gray-57 text-sm">3/10</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex flex-col text-gray-57 text-sm space-y-2">
            <div class="leading-3">支持JPG/PNG格式，建議尺寸為480x280</div>
            <div class="leading-3">每張不超过 1 MB</div>
          </div>
          <div>
            <Button contrast size="md" class="w-max">自訂樣式</Button>
          </div>
        </div>
      </div>
      <div class="mt-30 flex flex-col space-y-20">
        <InputWrap v-model="subPlanName" :label="'訂閱方案名稱'" :placeholder="'請輸入訂閱方案名稱'"></InputWrap>
        <InputWrap v-model="subPlanContent" :label="'訂閱方案內容'" :placeholder="'請輸入訂閱方案內容'"></InputWrap>
        <InputWrap
          v-model="subPlanPrice"
          :label="'價格'"
          :sublabel="'单位：美金'"
          :placeholder="'9.99'"
          :appendText="'最高设置为90元'"
          :maxLength="5"
        ></InputWrap>
        <div class="grid space-y-10">
          <label class="text-base font-normal not-italic leading-md text-left">解锁允许自购买后过去几天的作品？</label>
          <div class="flex flex-wrap space-y-5">
            <InputRadio
              v-model="selectedValue"
              id="radioOption1"
              label="30 day(s)"
              :value="30"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption2"
              label="90 day(s)"
              :value="90"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption3"
              label="360 day(s)"
              :value="360"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption5"
              label="Custom"
              value="custom"
              name="radio"
              :placeholder="'Please enter duration'"
              :includeInputWrap="true"
              @update:modelValue="handleUpdate"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="py-30 px-25">
      <Button @click="onSubmit" size="lg">{{ addSubPlan ? '立即發布' : '保存' }}</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputRadio from '@comp/form/InputRadio.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request'

const subPlanStore = useSubPlanStore()
const { back, close } = subPlanStore
const {
  history,
  data,
  index,
  addSubPlan,
  subPlanName,
  subPlanContent,
  subPlanPrice,
  subUnlockDayAfter,
  subId,
  subExpireDays,
} = storeToRefs(subPlanStore)
const showBack = computed(() => history.value.length > 0)

const selectedValue = ref(0)
const wrapValue = ref(0)

const handleUpdate = (value) => {
  if (value === 'custom' && wrapValue.value !== '') {
    console.log(selectedValue.value, wrapValue.value)
  }
}
watch(wrapValue, (newValue) => {
  if (newValue) {
    wrapValue.value = newValue
  }
})

onMounted(() => {
  subPlanName.value = data.value[index.value]?.name
  subPlanContent.value = data.value[index.value]?.content
  subPlanPrice.value = data.value[index.value]?.price
  subUnlockDayAfter.value = data.value[index.value]?.unlock_day_after_subscribe
  subId.value = data.value[index.value]?.id
  subExpireDays.value = data.value[index.value]?.expire_days
  selectedValue.value = subExpireDays.value
  console.log(subExpireDays.value, selectedValue.value)
})

watch(index, (newIndex) => {
  if (newIndex !== null && data.value[newIndex]) {
    subPlanName.value = data.value[newIndex].name
    subPlanContent.value = data.value[newIndex].content
    subPlanPrice.value = data.value[newIndex].price
    subUnlockDayAfter.value = data.value[index.value].unlock_day_after_subscribe
    subId.value = data.value[index.value].id
  }
})

const delSubPlan = () => {
  console.log('刪除這篇訂閱方案')
}

const onSubmit = async () => {
  if (addSubPlan) {
    const { execute: subPlanUpdate } = useRequest('Subscription.update')
    const payload = {
      id: subId.value,
      name: subPlanName.value,
      content: subPlanContent.value,
      price: subPlanPrice.value,
      unlock_day_after_subscribe: subUnlockDayAfter.value,
    }
    try {
      await subPlanUpdate(payload)
      console.log('成功囉！')
      close()
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log(selectedValue.value)
  }
}
</script>
