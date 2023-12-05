<template>
  <Page>
    <template #default>
      <!-- {{ content }} -->
    </template>
    <template #main-top>
      <div class="my-10 grid gap-y-10 px-10">
        <div>【 Input Text | Password | Number 】</div>
        <InputWrap
          v-model="inputValue"
          :label="'標題'"
          :placeholder="'搜索...'"
          :appendIcon="'heartActive'"
          class="w-96"
          @click="console.log('123')"
        ></InputWrap>
        <p class="font-size-12">輸入的值：{{ inputValue }}</p>
        <hr />
        <div>【 Input Radio 】</div>
        <InputRadio v-model="selectedValue" id="radioOption1" label="Option 1" value="option1" name="options" />
        <InputRadio v-model="selectedValue" id="radioOption2" label="Option 2" value="option2" name="options" />
        <p class="font-size-12">選擇的值：{{ selectedValue }}</p>
        <hr />
        <div>【 Input Switch 】</div>
        <InputSwitch :label="'選取切換'" v-model="switchValue"></InputSwitch>
        <p class="font-size-12">選擇的值：{{ switchValue }}</p>
        <hr />
        <div>【 Text Style 】</div>
        <div class="font-size-25 line-height-25 font-bold">Helvetica Neue-25-特重标题</div>
        <div class="font-size-18 line-height-18 font-bold">Helvetica Neue-18-大标题</div>
        <div class="font-size-14 line-height-18 font-normal">Helvetica Neue-14-正文</div>
        <div class="font-size-12 line-height-12 font-normal">＠Helvetica Neue-12-注释</div>
        <div class="font-size-14 line-height-14 font-bold">Helvetica Neue-14-按钮</div>
        <div class="font-size-14 line-height-14 font-normal">Helvetica Neue-14-按钮未选中</div>
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
      </div>
      <hr />
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '../../components/form/InputWrap.vue'
import InputRadio from '../../components/form/InputRadio.vue'
import InputSwitch from '../../components/form/InputSwitch.vue'

const inputValue = ref('')
const selectedValue = ref('option1')
const switchValue = ref(true)
</script>
