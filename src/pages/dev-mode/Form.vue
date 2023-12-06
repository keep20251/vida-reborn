<template>
  <Page>
    <template #default>
      <div class="my-10 grid gap-y-10 px-10">
        <div>【 Input Text | Password | Number 】</div>

        <InputWrap v-model="inputValue" :title="'帳號'" :subtitle="'(必填)'" class="w-[353px]"></InputWrap>

        <InputWrap
          v-model="inputValue"
          :title="'Price'"
          :subtitle="'单位：美金'"
          :placeholder="'9.99'"
          :appendText="'最高设置为90元'"
          class="w-[353px]"
          :maxLength="5"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="'搜索...'"
          :appendIcon="'search'"
          class="w-[353px]"
          @click:append="console.log('appendIcon')"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="'Add new tag...'"
          :appendTextBtn="'Add'"
          class="w-[353px]"
          @click:append="console.log('appendTextBtn')"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="'Add new tag...'"
          :appendIconBtn="'sendWhite'"
          class="w-[353px]"
          @click:append="console.log('appendIconBtn')"
        ></InputWrap>

        <p class="text-[0.75rem]">輸入的值：{{ inputValue }}</p>

        <hr />

        <div>【 Input Radio 】</div>
        <InputRadio
          disabled
          v-model="selectedValue"
          id="radioOption1"
          label="Option radio 1"
          value="radio1"
          name="radio"
        />
        <InputRadio v-model="selectedValue" id="radioOption2" label="Option radio 2" value="radio2" name="radio" />
        <InputRadio v-model="selectedValue" id="radioOption3" label="Option radio 3" value="radio3" name="radio" />
        <p class="text-[0.75rem]">選擇的值：{{ selectedValue }}</p>
        <hr />

        <div>【 Input Switch 】</div>
        <InputSwitch :label="'選取切換'" v-model="switchValue"></InputSwitch>
        <p class="text-[0.75rem]">選擇的值：{{ switchValue }}</p>
        <hr />

        <div>【 Text Style 】</div>
        <div class="text-[1.5625rem] font-bold leading-[1.5625rem]">Helvetica Neue-25-特重标题</div>
        <div class="text-[1.125rem] font-bold leading-[1.125rem]">Helvetica Neue-18-大标题</div>
        <div class="text-[0.875rem] font-normal leading-[1.125rem]">Helvetica Neue-14-正文</div>
        <div class="text-[0.75rem] font-normal leading-[0.75rem]">＠Helvetica Neue-12-注释</div>
        <div class="text-[0.875rem] font-bold leading-[0.875rem]">Helvetica Neue-14-按钮</div>
        <div class="text-[0.875rem] font-normal leading-[0.875rem]">Helvetica Neue-14-按钮未选中</div>
        <hr />
        <div>【 Dropdown 】</div>
        <div class="bg-gray05 p-8">
          <Dropdown class="w-96" v-model="dropdownValue" :options="options"></Dropdown>
        </div>
        <hr />
        <div>【 Button 】</div>
        <div class="mb-8">
          <button class="bg-primary rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white">
            primary button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="bg-primary w-1/2 rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            primary half width button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="bg-primary w-full rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            primary full width button
          </button>
        </div>
        <div class="mb-8">
          <button class="bg-contrast rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white">
            contrast button
          </button>
        </div>
        <div class="mb-8">
          <button
            class="from-primary to-contrast rounded-[1.125rem] bg-gradient-to-r px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            gradient button
          </button>
        </div>
        <div class="flex space-x-8">
          <button
            class="bg-gray30 w-1/2 rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            cancel button
          </button>
          <button
            class="bg-primary w-1/2 rounded-[1.125rem] px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          >
            confirm button
          </button>
        </div>
        <hr />
        <div>【 OptionsPicker 】</div>
        <OptionsPicker v-model="pickedOptions" :options="options"></OptionsPicker>
        <p class="text-[0.75rem]">選擇的值：{{ pickedOptions }}</p>
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
import Dropdown from '@comp/form/Dropdown.vue'

const inputValue = ref('')
const selectedValue = ref('radio2')
const switchValue = ref(true)

const dropdownValue = ref(1)

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
