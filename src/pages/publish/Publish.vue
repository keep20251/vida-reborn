<template>
  <Page>
    <template #main-top>
      <Head></Head>
    </template>
    <template #default>
      <div class="flex flex-col space-y-20 pb-30">
        <!-- 選擇主題 -->
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">選擇主題</label>
          <Dropdown v-model="category" :options="options" inset></Dropdown>
        </div>

        <!-- 上傳視頻 -->
        <div class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md">上傳視頻</label>
              <span class="text-gray-57 text-left text-sm">支持mp4/mov格式，不超過 100 MB</span>
            </div>
            <Button class="self-end" size="md">重新選擇</Button>
          </div>
          <div class="rounded-md bg-orange-200 pb-[64%]"></div>
        </div>

        <!-- 上傳圖片 -->
        <div class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md"
                >上傳圖片 <span class="text-gray-57 text-left text-sm">10/10</span></label
              >
              <span class="text-gray-57 text-left text-sm">支持JPG/PNG格式，每张不超過1MB</span>
            </div>
            <Button class="self-end" size="md">添加</Button>
          </div>
          <div class="grid grid-cols-3 gap-10">
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-0 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-100 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-75 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-50 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-sm pb-[64%]">
              <div class="absolute top-0 h-full w-full bg-orange-100"></div>
              <div
                class="absolute top-0 h-full w-full origin-right scale-x-75 bg-white opacity-60 will-change-transform"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 標題 -->
        <InputWrap v-model="title" :label="'標題'" :err-msg="'標題不得為空'"></InputWrap>

        <!-- 內文 -->
        <TextareaWrap
          v-model="content"
          :label="'內文'"
          :placeholder="'填寫内文'"
          :line="6"
          :err-msg="'錯誤訊息'"
        ></TextareaWrap>

        <!-- Tag -->
        <div class="flex flex-col">
          <label class="-mb-5 text-left text-base leading-md">Tag</label>
          <OptionsPicker v-model="tag" :options="tagOptions"></OptionsPicker>
          <InputWrap
            class="mt-10"
            v-model="tagInput"
            :placeholder="'Add new tag...'"
            :append-text-btn="'Add'"
            @click:append="addTag"
          ></InputWrap>
        </div>

        <!-- 誰可以看到 -->
        <div class="flex flex-col">
          <label class="-mb-5 text-left text-base leading-md">
            誰可以看到
            <span class="text-gray-57 text-sm leading-3">允許特定訂閱方案查看</span>
          </label>
          <OptionsPicker v-model="perm" :options="permOptions"></OptionsPicker>
        </div>

        <!-- 指定訂閱組 -->
        <div class="flex flex-col">
          <label class="-mb-5 text-left text-base leading-md">指定訂閱組</label>
          <OptionsPicker v-model="sub" :options="subOptions"></OptionsPicker>
        </div>

        <!-- Price -->
        <InputWrap
          v-model="price"
          :label="'Price'"
          :sublabel="'單位：美金'"
          :placeholder="'9.99'"
          :append-text="'最高設置為90元'"
          :max-length="5"
        ></InputWrap>

        <!-- 排定發布 -->
        <div class="flex flex-col space-y-10">
          <div class="flex justify-between">
            <label class="text-left text-base leading-md">排定發布</label>
            <InputSwitch v-model="schedule"></InputSwitch>
          </div>
          <InputWrap v-show="schedule" v-model="scheduleDateModel" append-icon="calendar" disabled></InputWrap>
        </div>

        <Button>發布</Button>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref } from 'vue'
import Button from '@comp/common/Button.vue'
import Dropdown from '@comp/form/Dropdown.vue'
import InputSwitch from '@comp/form/InputSwitch.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import Head from '@comp/navigation/Head.vue'
import { toDateTimeString } from '@/utils/string-helper'

const category = ref(1)
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

const schedule = ref(false)
const scheduleDate = ref(new Date())
const scheduleDateModel = computed({
  get() {
    return toDateTimeString(scheduleDate.value).substring(0, 16)
  },
  set(v) {
    scheduleDate.value = v
  },
})
</script>
