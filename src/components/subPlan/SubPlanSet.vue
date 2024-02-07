<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative text-center py-15 px-20 rounded-t-xl">
      <div class="absolute left-0 top-1/3 pl-20">
        <button @click="back" :history="history" :show-back="showBack">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">新增/編輯 訂閱設定</div>
      <button @click="delSubPlan" class="absolute right-0 pr-20 top-1/3">
        <Icon name="bin"></Icon>
      </button>
    </div>
    <div class="px-25 pt-10 pb-20 overflow-y-scroll scrollbar-md pr-15 max-h-[75vh]">
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
            <Button contrast size="md">自訂樣式</Button>
          </div>
        </div>
      </div>
      <div class="mt-30 flex flex-col space-y-20">
        <InputWrap v-model="inputValue" :label="'訂閱方案名稱'" :placeholder="'請輸入訂閱方案名稱'"></InputWrap>
        <InputWrap v-model="inputValue" :label="'訂閱方案內容'" :placeholder="'請輸入訂閱方案內容'"></InputWrap>
        <InputWrap
          v-model="inputValue"
          :label="'Price'"
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
              value="radio1"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption2"
              label="90 day(s)"
              value="radio2"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption3"
              label="360 day(s)"
              value="radio3"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption4"
              label="All past Content"
              value="radio4"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption5"
              label="Custom"
              value="radio5"
              name="radio"
              :placeholder="'Please enter duration'"
              :includeInputWrap="true"
              @update:modelValue="handleSelectedValue"
            />
          </div>
        </div>
        <div class="pt-10">
          <Button @click="onSubmit" size="lg">立即發布</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputRadio from '@comp/form/InputRadio.vue'
import InputWrap from '@comp/form/InputWrap.vue'

const subPlanStore = useSubPlanStore()
const { back } = subPlanStore
const { history } = storeToRefs(subPlanStore)
const showBack = computed(() => history.value.length > 0)

const delSubPlan = () => {
  console.log('刪除這篇訂閱方案')
}

const inputValue = ref('')
const selectedValue = ref('radio2')
const wrapValue = ref('')

const handleSelectedValue = (value) => {
  if (value === 'radio5' && wrapValue.value.trim() !== '') {
    selectedValue.value = wrapValue.value
  }
}

const onSubmit = () => {
  console.log(selectedValue.value)
}
</script>
