<template>
  <Page>
    <template #default>
      <!-- {{ content }} -->
    </template>
    <template #main-top>
      <div class="my-10 grid w-5/6 gap-y-10 px-10">
        <div>【 Input Text | Password | Number 】</div>
        <InputWrap v-model="inputValue" :placeholder="'我是标题，不是必填'" :label="'标题'" text></InputWrap>
        <p class="font-size-12">輸入的值：{{ inputValue }}</p>
        <hr />
        <div>【 Input Radio 】</div>
        <InputRadio v-model="selectedValue" id="radioOption1" label="Option 1" value="option1" name="options" />
        <InputRadio v-model="selectedValue" id="radioOption2" label="Option 2" value="option2" name="options" />
        <p class="font-size-12">選擇的值：{{ selectedValue }}</p>
        <hr />
        <div>【 Text Style 】</div>
        <div class="font-size-25 line-height-25 font-bold">Helvetica Neue-25-特重标题</div>
        <div class="font-size-18 line-height-18 font-bold">Helvetica Neue-18-大标题</div>
        <div class="font-size-14 line-height-18 font-normal">Helvetica Neue-14-正文</div>
        <div class="font-size-12 line-height-12 font-normal">＠Helvetica Neue-12-注释</div>
        <div class="font-size-14 line-height-14 font-bold">Helvetica Neue-14-按钮</div>
        <div class="font-size-14 line-height-14 font-normal">Helvetica Neue-14-按钮未选中</div>
        <hr />
      </div>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '../../components/form/InputWrap.vue'
import InputRadio from '../../components/form/InputRadio.vue'

const inputValue = ref('')
const selectedValue = ref('option1')
</script>
