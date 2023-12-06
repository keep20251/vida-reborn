<template>
  <Page>
    <template #default>
      <div class="my-10 grid gap-y-10 px-10">
        <div>【 Input Text | Password | Number 】</div>
        <InputWrap
          v-model="inputValue"
          :title="'標題'"
          :subtitle="'(必填)'"
          :placeholder="'搜索...'"
          :appendIcon="'emoji'"
          class="w-96"
          @click="console.log('123')"
        ></InputWrap>
        <p class="text-12">輸入的值：{{ inputValue }}</p>
        <hr />

        <div>【 Input Radio 】</div>
        <InputRadio v-model="selectedValue" id="radioOption1" label="Option radio 1" value="radio1" name="radio" />
        <InputRadio v-model="selectedValue" id="radioOption2" label="Option radio 2" value="radio2" name="radio" />
        <p class="text-12">選擇的值：{{ selectedValue }}</p>
        <hr />

        <div>【 Input Switch 】</div>
        <InputSwitch :label="'選取切換'" v-model="switchValue"></InputSwitch>
        <p class="text-12">選擇的值：{{ switchValue }}</p>
        <hr />

        <div>【 Text Style 】</div>
        <div class="text-25 font-bold leading-[1.5625rem]">Helvetica Neue-25-特重标题</div>
        <div class="text-18 font-bold leading-[1.125rem]">Helvetica Neue-18-大标题</div>
        <div class="text-14 font-normal leading-[1.125rem]">Helvetica Neue-14-正文</div>
        <div class="text-12 font-normal leading-[0.75rem]">＠Helvetica Neue-12-注释</div>
        <div class="text-14 font-bold leading-[0.875rem]">Helvetica Neue-14-按钮</div>
        <div class="text-14 font-normal leading-[0.875rem]">Helvetica Neue-14-按钮未选中</div>
        <hr />
        <div>【 Button 】</div>
        <div class="mb-8">
          <button class="rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white">
            primary button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="w-1/2 rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            primary half width button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="w-full rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            primary full width button
          </button>
        </div>
        <div class="mb-8">
          <button class="rounded-[1.125rem] bg-contrast px-45 py-10 text-sm font-bold leading-[0.875rem] text-white">
            contrast button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="rounded-[1.125rem] bg-gradient-to-r from-primary to-contrast px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            gradient button
          </button>
        </div>
        <div class="flex space-x-8">
          <button
            class="w-1/2 rounded-[1.125rem] bg-gray30 px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            cancel button
          </button>
          <button
            class="w-1/2 rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            confirm button
          </button>
        </div>
        <hr />
        <OptionsPicker v-model="pickedOptions" :options="options"></OptionsPicker>
        <p class="font-size-12">選擇的值：{{ pickedOptions }}</p>
        <hr />
      </div>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import InputRadio from '@comp/form/InputRadio.vue'
import InputSwitch from '@comp/form/InputSwitch.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'

const inputValue = ref('')
const selectedValue = ref('radio1')
const switchValue = ref(true)

const pickedOptions = ref([1])
const options = ref([
  { label: 'Option1', value: 1 },
  { label: 'Option2', value: 2 },
  { label: 'Option3', value: 3 },
  { label: 'Option4', value: 4 },
  { label: 'Option5', value: 5 },
  { label: 'Option6', value: 6 },
  { label: 'Option7', value: 7 },
  { label: 'Option8', value: 8 },
  { label: 'Option9', value: 9 },
  { label: 'Option10', value: 10 },
])
</script>
