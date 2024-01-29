<template>
  <Page>
    <template #main-top>
      <Head :title="'發布帖子'" feature-icon="close" @feature="onClose"></Head>
    </template>
    <template #default>
      <div class="flex flex-col space-y-20 pb-30">
        <!-- 選擇主題 -->
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">選擇主題</label>
          <Dropdown v-model="category" :options="options" inset></Dropdown>
        </div>

        <!-- 上傳視頻 -->
        <div v-if="isVideo" class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md">上傳視頻</label>
              <span class="text-left text-sm text-gray-57">支持mp4/mov格式，不超過 100 MB</span>
            </div>
            <Button class="self-end" size="md">重新選擇</Button>
          </div>
          <video ref="video" controls></video>
          <!-- <div class="rounded-md bg-orange-200 pb-[64%]"></div> -->
        </div>

        <!-- 上傳圖片 -->
        <div v-if="isImage" class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md"
                >上傳圖片
                <span class="text-left text-sm text-gray-57">{{
                  `${uploadFiles.filter((f) => f.status === UPLOAD_STATUS.DONE).length}/${IMAGE_LIMIT_COUNT}`
                }}</span></label
              >
              <span class="text-left text-sm text-gray-57">支持JPG/PNG格式，每张不超過1MB</span>
            </div>
            <Button class="self-end" size="md" @click="() => inputImage.click()">添加</Button>
            <input
              type="file"
              class="hidden"
              accept="video/mp4, video/quicktime, video/x-quicktime, video/mov, video/x-mov, video/avi, image/jpg, image/jpeg, image/png, image/gif"
              multiple
              ref="inputImage"
              @change="onImageFile"
            />
          </div>
          <div class="grid grid-cols-3 gap-10">
            <div v-for="file in uploadFiles" class="relative overflow-hidden rounded-sm pb-[64%]" :key="file.id">
              <div class="absolute top-0 h-full w-full">
                <img :src="file.result" class="h-full w-full rounded-sm object-cover" />
              </div>
              <div
                class="absolute top-0 h-full w-full origin-right bg-white opacity-60 will-change-transform"
                :style="{ transform: `scaleX(${1 - file.progress})` }"
              ></div>
              <div
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
                @click="removeUploadFile(file.id)"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 標題 -->
        <InputWrap v-model="publishParams.title" :label="'標題'"></InputWrap>

        <!-- 內文 -->
        <TextareaWrap
          v-model="publishParams.content"
          :label="'內文'"
          :placeholder="'填寫内文'"
          :line="6"
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
            <span class="text-sm leading-3 text-gray-57">允許特定訂閱方案查看</span>
          </label>
          <OptionsPicker v-model="publishParams.perm" :options="permOptions"></OptionsPicker>
        </div>

        <!-- 指定訂閱組 -->
        <div v-if="publishParams.perm === FEED_PERM.SUB" class="flex flex-col">
          <label class="-mb-5 text-left text-base leading-md">指定訂閱組</label>
          <OptionsPicker v-model="publishParams.sub" :options="subOptions"></OptionsPicker>
        </div>

        <!-- Price -->
        <InputWrap
          v-if="publishParams.perm === FEED_PERM.BUY"
          v-model="publishParams.price"
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
            <InputSwitch v-model="publishTimeOpen"></InputSwitch>
          </div>
          <InputWrap v-show="publishTimeOpen" v-model="postTimeModel" append-icon="calendar" disabled></InputWrap>
        </div>

        <Button>發布</Button>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePublishStore } from '@/store/publish'
import Button from '@comp/common/Button.vue'
import Dropdown from '@comp/form/Dropdown.vue'
import InputSwitch from '@comp/form/InputSwitch.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import Head from '@comp/navigation/Head.vue'
import { toDateTimeString } from '@/utils/string-helper'
import { FEED_PERM, IMAGE_LIMIT_COUNT, UPLOAD_STATUS } from '@/constant/publish'

const publishStore = usePublishStore()
const { publishParams, uploadFiles, publishTimeOpen, isVideo, isImage, isEditing } = storeToRefs(publishStore)
const { startUpload, clear, addImageFile, removeUploadFile } = publishStore

const router = useRouter()

const inputImage = ref(null)

const video = ref(null)
watch(
  isEditing,
  async (v) => {
    if (v) {
      try {
        await startUpload(video)
      } catch (e) {
        console.error(e)
        router.back()
      }
    }
  },
  { immediate: true },
)

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

const permOptions = ref([
  { label: '訂閱者', value: FEED_PERM.SUB },
  { label: '商店販售', value: FEED_PERM.BUY },
])

const subOptions = ref([
  { label: '全部', value: 1 },
  { label: '鑽石訂閱', value: 2 },
  { label: '黃金訂閱', value: 3 },
  { label: '白金訂閱', value: 4 },
])

const postTimeModel = computed(() => {
  if (publishTimeOpen.value) {
    return toDateTimeString(publishParams.value.postTime).substring(0, 16)
  }
  return ''
})

function onImageFile(evt) {
  const files = evt.target.files
  if (files.length > 0) {
    addImageFile(files)
  }
}

function onClose() {
  clear()
  router.back()
}
</script>
