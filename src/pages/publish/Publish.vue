<template>
  <Page>
    <template #main-top>
      <Head :title="$t('title.publish')" feature-icon="close" @back="clear" @feature="onDelete"></Head>
    </template>
    <template #default>
      <div class="flex flex-col space-y-20 pb-30">
        <!-- 選擇主題 -->
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">{{ $t('label.pickCaterory') }}</label>
          <Dropdown v-model="publishParams.category" :options="categories" inset></Dropdown>
        </div>

        <!-- 上傳視頻 -->
        <div v-if="isVideo" class="flex flex-col">
          <div class="mb-10 flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md">{{ $t('label.uploadVideo') }}</label>
              <span class="text-left text-sm text-gray-57">{{ $t('info.videoFormat') }}</span>
            </div>
            <Button class="self-end" size="md" @click="() => inputVideo.click()">{{ $t('common.reSelect') }}</Button>
            <input
              type="file"
              class="hidden"
              accept="video/mp4, video/quicktime, video/x-quicktime, video/mov, video/x-mov, video/avi"
              multiple
              ref="inputVideo"
              @change="onVideoFile"
            />
          </div>
          <div class="relative overflow-hidden rounded-sm pb-[64%]">
            <video class="absolute left-1/2 top-0 h-full -translate-x-1/2" ref="video" controls></video>
            <div
              v-if="uploadFiles[0].status !== UPLOAD_STATUS.DONE"
              class="absolute top-0 h-full w-full bg-black p-20 text-right text-white opacity-70"
            >
              {{ $t('info.uploadProgress', { progress: Math.floor(uploadFiles[0].progress * 100) }) }}
            </div>
          </div>
        </div>

        <!-- 上傳圖片 -->
        <div v-if="isImage" class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md"
                >{{ $t('label.uploadImage') }}
                <span class="text-left text-sm text-gray-57">{{
                  `${uploadFiles.filter((f) => f.status === UPLOAD_STATUS.DONE).length}/${IMAGE_LIMIT_COUNT}`
                }}</span></label
              >
              <span class="text-left text-sm text-gray-57">{{ $t('info.imageFormat') }}</span>
            </div>
            <Button class="self-end" size="md" @click="() => inputImage.click()">{{ $t('common.append') }}</Button>
            <input
              type="file"
              class="hidden"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              multiple
              ref="inputImage"
              @change="onImageFile"
            />
          </div>
          <div class="grid grid-cols-3 gap-10">
            <div v-for="file in uploadFiles" class="relative overflow-hidden rounded-sm pb-[64%]" :key="file.id">
              <div class="absolute top-0 h-full w-full">
                <EncryptImage v-if="file.status === UPLOAD_STATUS.SAVE" :src="file.url" cover></EncryptImage>
                <img v-else :src="file.result" class="h-full w-full rounded-sm object-cover" />
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
        <InputWrap v-model="publishParams.title" :label="$t('label.title')" :err-msg="titleError"></InputWrap>

        <!-- 內文 -->
        <TextareaWrap
          v-model="publishParams.content"
          :label="$t('label.content')"
          :err-msg="contentError"
          :line="6"
        ></TextareaWrap>

        <!-- Tag -->
        <TagEditor v-model="publishParams.tags" :err-msg="tagError"></TagEditor>

        <!-- 誰可以看到 -->
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">
            {{ $t('label.pickPerm') }}
            <span class="text-sm leading-3 text-gray-57">{{ $t('label.pickPermSub') }}</span>
          </label>
          <OptionsPicker v-model="publishParams.perm" :options="permOptions"></OptionsPicker>
        </div>

        <!-- 指定訂閱組 -->
        <div v-if="publishParams.perm === FEED_PERM.SUB" class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">{{ $t('label.pickSub') }}</label>
          <OptionsPicker v-model="publishParams.subs" :options="subOptions"></OptionsPicker>
        </div>

        <!-- Price -->
        <InputWrap
          v-if="publishParams.perm === FEED_PERM.BUY"
          v-model="publishParams.price"
          :label="$t('label.price')"
          :sublabel="$t('label.priceSub')"
          :placeholder="'9.99'"
          :err-msg="priceError"
          :append-text="$t('label.priceTip', { price: 90 })"
          :max-length="5"
        ></InputWrap>

        <!-- 排定發布 -->
        <div class="relative flex flex-col space-y-10">
          <div class="flex justify-between">
            <label class="text-left text-base leading-md">{{ $t('label.schedule') }}</label>
            <InputSwitch v-model="publishTimeOpen"></InputSwitch>
          </div>
          <InputWrap
            v-show="publishTimeOpen"
            v-model="postTimeModel"
            append-icon="calendar"
            disabled
            @click:append="postTimeEditing = true"
          ></InputWrap>
          <DatePicker
            class="absolute bottom-36 self-end"
            v-if="publishTimeOpen && postTimeEditing"
            v-model="publishParams.postTime"
            include-time
            @close="postTimeEditing = false"
          ></DatePicker>
        </div>

        <Button :loading="publishing" :disabled="isUploading" @click="publish">{{ $t('common.publish') }}</Button>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import { usePublishStore } from '@/store/publish'
import Button from '@comp/common/Button.vue'
import DatePicker from '@comp/form/DatePicker.vue'
import Dropdown from '@comp/form/Dropdown.vue'
import InputSwitch from '@comp/form/InputSwitch.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import TagEditor from '@comp/form/TagEditor.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import Head from '@comp/navigation/Head.vue'
import useRequest from '@use/request'
import { useRouters } from '@use/routers'
import { useYup } from '@use/validator/yup.js'
import { POST_TAB_TYPE } from '@const/mine'
import { FEED_PERM, IMAGE_LIMIT_COUNT, UPLOAD_STATUS } from '@const/publish'
import { toDateTimeString } from '@/utils/string-helper'

const { t: $t } = useI18n()

const publishStore = usePublishStore()
const { uploadFiles, publishTimeOpen, isCreate, isUpdate, isVideo, isImage, isEditing, isUploading } =
  storeToRefs(publishStore)
const { publishParams, startUpload, clear, changeVideoFile, addImageFile, removeUploadFile } = publishStore

const { alert, confirm } = useModalStore()

const accountStore = useAccountStore()
const { userData } = storeToRefs(accountStore)

const { reloadPost } = useMineStore()

const { back, to } = useRouters()

const publishing = ref(false)
const inputVideo = ref(null)
const inputImage = ref(null)

const video = ref(null)
watch(
  isEditing,
  async (v) => {
    if (v && isCreate.value) {
      try {
        if (userData.value.subscription_list.length > 0) {
          publishParams.subs.push(userData.value.subscription_list[0].id)
        }
        await startUpload(video)
      } catch (e) {
        console.error(e)
        back()
      }
    }
  },
  { immediate: true },
)

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const permOptions = ref([
  { label: $t('label.sub'), value: FEED_PERM.SUB },
  { label: $t('label.buy'), value: FEED_PERM.BUY },
  { label: $t('label.private'), value: FEED_PERM.PRI },
])

const subOptions = computed(() => userData.value.subscription_list.map((sub) => ({ label: sub.name, value: sub.id })))

const postTimeEditing = ref(false)
const postTimeModel = computed(() => {
  if (publishTimeOpen.value) {
    return toDateTimeString(publishParams.postTime).substring(0, 16)
  }
  return ''
})

function onVideoFile(evt) {
  const files = evt.target.files
  if (files.length > 0) {
    changeVideoFile(files, video)
  }
}

function onImageFile(evt) {
  const files = evt.target.files
  if (files.length > 0) {
    addImageFile(files)
  }
}

function onClose(toMinePostTab) {
  clear()

  if (toMinePostTab) {
    to('mine-post', { query: { t: toMinePostTab } })
  } else {
    back()
  }
}

function onDelete() {
  if (isUpdate.value) {
    confirm({
      title: 'info.whetherDelArticle',
      async confirmAction() {
        try {
          await useRequest('Article.delete', { params: { article_id: publishParams.id }, immediate: true })
          reloadPost()
          onClose()
        } catch (e) {
          return e.message
        }
      },
      cancelAction() {},
    })
  } else {
    onClose()
  }
}

function publish() {
  if (!validation()) return

  const data = makeReqData()
  let toMinePostTab
  if (isCreate.value) {
    if (publishTimeOpen.value) {
      toMinePostTab = POST_TAB_TYPE.SCH
    } else if (publishParams.perm === FEED_PERM.SUB) {
      toMinePostTab = POST_TAB_TYPE.SUB
    } else if (publishParams.perm === FEED_PERM.BUY) {
      toMinePostTab = POST_TAB_TYPE.BUY
    }
  }

  publishing.value = true
  useRequest('Article.publish', { params: data, immediate: true })
    .then(() => {
      alert({
        title: 'title.publishSuccess',
        confirmAction() {
          reloadPost()
          onClose(toMinePostTab)
        },
      })
    })
    .catch((e) => {
      alert({
        title: 'title.publishFail',
        content: e.message,
      })
    })
    .finally(() => (publishing.value = false))
}

function makeReqData() {
  const data = {
    category: publishParams.category,
    title: publishParams.title,
    content: publishParams.content,
    tags: publishParams.tags.join(','),
    resource_type: publishParams.type,
    article_type: publishParams.perm,
  }

  if (isUpdate.value) {
    data.id = publishParams.id
  }

  if (publishParams.perm === FEED_PERM.SUB) {
    data.subscription_ids = publishParams.subs.join(',')
  }

  if (publishParams.perm === FEED_PERM.BUY) {
    data.price = parseFloat(publishParams.price)
  }

  if (isVideo.value) {
    data.content_url = uploadFiles.value[0].url
  }

  if (isImage.value) {
    data.content_url = uploadFiles.value.map((f) => f.url).join(',')
    data.content_width = uploadFiles.value.map((f) => f.width).join(',')
    data.content_height = uploadFiles.value.map((f) => f.height).join(',')
  }

  if (publishTimeOpen.value) {
    data.start_date = postTimeModel.value + ':00'
  }

  return data
}

const { Yup, parseError } = useYup()
const titleSchema = Yup.string().required()
const titleError = ref('')
const contentSchema = Yup.string().required()
const contentError = ref('')
const tagError = ref('')
const priceSchema = Yup.number().positive().max(90)
const priceError = ref('')
function validation() {
  let result = true

  titleError.value = ''
  try {
    titleSchema.validateSync(publishParams.title)
  } catch (e) {
    titleError.value = parseError(e)
    result = false
  }

  contentError.value = ''
  try {
    contentSchema.validateSync(publishParams.content)
  } catch (e) {
    contentError.value = parseError(e)
    result = false
  }

  priceError.value = ''
  if (publishParams.perm === FEED_PERM.BUY) {
    try {
      priceSchema.validateSync(publishParams.price)
    } catch (e) {
      priceError.value = parseError(e)
      result = false
    }
  }

  return result
}
</script>
