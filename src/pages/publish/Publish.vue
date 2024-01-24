<template>
  <Page>
    <template #main-top>
      <Head></Head>
    </template>
    <template #default>
      <div class="flex flex-col space-y-20">
        <InputWrap v-model="title" :label="'標題'" :errMsg="'標題不得為空'"></InputWrap>
        <TextareaWrap
          v-model="content"
          :label="'內文'"
          :placeholder="'填寫内文'"
          :line="6"
          :errMsg="'錯誤訊息'"
        ></TextareaWrap>
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base font-normal not-italic leading-md">Tag</label>
          <OptionsPicker v-model="tag" :options="tagOptions"></OptionsPicker>
          <InputWrap
            v-model="tagInput"
            :placeholder="'Add new tag...'"
            :appendTextBtn="'Add'"
            @click:append="addTag"
          ></InputWrap>
        </div>
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base font-normal not-italic leading-md">
            誰可以看到
            <span class="text-sm font-normal not-italic leading-3 text-gray66">允許特定訂閱方案查看</span>
          </label>
          <OptionsPicker v-model="perm" :options="permOptions"></OptionsPicker>
        </div>
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base font-normal not-italic leading-md">指定訂閱組</label>
          <OptionsPicker v-model="sub" :options="subOptions"></OptionsPicker>
        </div>
        <InputWrap
          v-model="price"
          :label="'Price'"
          :sublabel="'單位：美金'"
          :placeholder="'9.99'"
          :appendText="'最高設置為90元'"
          :maxLength="5"
        ></InputWrap>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import Head from '@comp/navigation/Head.vue'

const title = ref('')
const content = ref('')

const tagInput = ref('')
const tag = ref([1, 3, 5])
const tagOptions = ref([
  { label: 'Tag1', value: 1 },
  { label: 'Tag2', value: 2 },
  { label: 'Tag3', value: 3 },
  { label: 'Tag4', value: 4 },
  { label: 'Tag5', value: 5 },
  { label: 'Tag6', value: 6 },
])
function addTag() {
  if (!tagInput.value) {
    return
  }
  if (tagOptions.value.filter((t) => t.label === tagInput.value).length === 0) {
    const value = new Date().getTime()
    tagOptions.value.push({ label: tagInput.value, value })
    tag.value.push(value)
    tagInput.value = ''
  }
}

const perm = ref(1)
const permOptions = ref([
  { label: '訂閱者', value: 1 },
  { label: '商店販售', value: 2 },
  { label: '僅限自己', value: 3 },
])

const sub = ref(1)
const subOptions = ref([
  { label: '全部', value: 1 },
  { label: '鑽石訂閱', value: 2 },
  { label: '黃金訂閱', value: 3 },
  { label: '白金訂閱', value: 4 },
])

const price = ref('')
</script>
