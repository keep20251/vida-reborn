<template>
  <Page>
    <template #main-top>
      <Head
        :title="isCreate ? $t('title.publish') : $t('title.editPost')"
        :feature-icon="isUpdate ? 'bin' : ''"
        :preBackFn="preClear"
        @back="handleClear"
        @feature="onDelete"
      ></Head>
    </template>
    <template #default>
      <div class="flex flex-col space-y-20 pb-30" :class="{ 'mb-60': isMobile }">
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
          </div>
          <div v-if="noUploadFiles" class="relative rounded-md pb-[56%]">
            <label
              class="absolute top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-10 rounded-inherit bg-gray-f6 py-72"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="62" height="55" viewBox="0 0 62 55" fill="none">
                <path
                  d="M23.2808 10.5731C22.0864 10.5731 21.118 11.5453 21.118 12.7441V14.8621C21.118 16.0611 22.0865 17.0331 23.2808 17.0331C24.4751 17.0331 25.4435 16.061 25.4435 14.8621V12.7441C25.4435 11.5451 24.4751 10.5731 23.2808 10.5731Z"
                  fill="#ECECEC"
                />
                <path
                  d="M38.7192 17.0331C39.9137 17.0331 40.8821 16.061 40.8821 14.8621V12.7441C40.8821 11.5451 39.9136 10.5731 38.7192 10.5731C37.5249 10.5731 36.5565 11.5453 36.5565 12.7441V14.8621C36.5564 16.061 37.5249 17.0331 38.7192 17.0331Z"
                  fill="#ECECEC"
                />
                <path
                  d="M25.8843 18.9147C24.8695 19.5475 24.5579 20.8862 25.1884 21.9045C25.9646 23.159 28.0951 25.282 31.1544 25.282C34.1983 25.282 36.3547 23.175 37.1493 21.93C37.7934 20.9201 37.5002 19.5774 36.4945 18.9307C35.4878 18.2844 34.1504 18.5784 33.5066 19.5879C33.4981 19.6018 32.5801 20.9399 31.1544 20.9399C29.7689 20.9399 28.9078 19.6798 28.85 19.5933C28.2153 18.5907 26.8918 18.2861 25.8843 18.9147Z"
                  fill="#ECECEC"
                />
                <path
                  d="M52.6279 0L35.1146 0C33.9201 0 32.9518 0.972129 32.9518 2.17102C32.9518 3.36991 33.9202 4.34204 35.1146 4.34204L52.6279 4.34204C55.4102 4.34204 57.6744 6.61449 57.6744 9.40782V37.0008L44.5639 25.5112C43.719 24.7705 42.4507 24.8017 41.6435 25.5805L27.9813 38.7496L16.9673 27.8615C16.1436 27.048 14.8274 27.0272 13.9791 27.8166L4.32561 36.8035L4.32561 9.40789C4.32561 6.61456 6.58942 4.34211 9.37214 4.34211L26.8854 4.34211C28.0799 4.34211 29.0482 3.36998 29.0482 2.17109C29.0482 0.9722 28.0798 0 26.8854 0L9.37214 0C4.20415 0 0 4.22019 0 9.40789L0 45.5921C0 50.7798 4.20415 55 9.37214 55H26.8854C28.0799 55 29.0482 54.0279 29.0482 52.829C29.0482 51.6301 28.0798 50.658 26.8854 50.658H9.37214C6.58942 50.658 4.32561 48.3855 4.32561 45.5922V42.7257L15.4051 32.4114L26.4448 43.325C27.2791 44.1497 28.6164 44.1579 29.4602 43.3441L43.2107 30.0895L57.6745 42.7643V45.5922C57.6745 48.3855 55.4103 50.658 52.6279 50.658H35.1146C33.9201 50.658 32.9518 51.6301 32.9518 52.829C32.9518 54.0279 33.9202 55 35.1146 55H52.6279C57.7955 55 62 50.7798 62 45.5921V9.40789C62 4.22019 57.7955 0 52.6279 0Z"
                  fill="#ECECEC"
                />
              </svg>
              <span class="text-base leading-lg text-gray-a3">{{ $t('content.tapForUpload') }}</span>
              <input
                type="file"
                class="hidden"
                accept="video/mp4, video/quicktime, video/x-quicktime, video/mov, video/x-mov, video/avi"
                multiple
                ref="inputVideo"
                @change="onVideoFile"
              />
            </label>
          </div>
          <div v-else class="relative overflow-hidden rounded-md pb-[56%]">
            <video class="absolute top-0 h-full w-full" ref="video" controls></video>
            <div
              v-if="uploadFiles[0].status !== UPLOAD_STATUS.DONE"
              class="absolute top-0 h-full w-full origin-right bg-white bg-opacity-60 p-20 will-change-transform"
              :style="{ transform: `scaleX(${1 - uploadFiles[0].progress})` }"
            ></div>
            <div class="absolute top-0 w-full">
              <div class="flex items-center justify-end space-x-10 pr-20 pt-20">
                <span class="text-sm text-white drop-shadow-sm">
                  {{
                    uploadFiles[0].status === UPLOAD_STATUS.UPLOADING
                      ? $t('info.uploadProgress', { progress: Math.floor(uploadFiles[0].progress * 100) })
                      : ''
                  }}
                </span>
                <div
                  v-if="isCreate"
                  @click="cancel(uploadFiles[0].id, uploadFiles[0].status)"
                  class="right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
                >
                  <Icon name="close" size="10"></Icon>
                </div>
              </div>
            </div>
          </div>
          <div v-if="uploadError" class="text-left text-sm font-normal not-italic leading-md text-warning">
            {{ uploadError }}
          </div>
        </div>

        <!-- 上傳圖片 -->
        <div v-if="isImage" class="flex flex-col space-y-10">
          <div class="flex">
            <div class="flex grow flex-col space-y-10">
              <label class="text-left text-base leading-md"
                >{{ $t('label.uploadImage') }}
                <span class="text-left text-sm text-gray-57">{{
                  `${
                    uploadFiles.filter((f) => [UPLOAD_STATUS.DONE, UPLOAD_STATUS.SAVE].includes(f.status)).length
                  }/${IMAGE_LIMIT_COUNT}`
                }}</span></label
              >
              <span class="text-left text-sm text-gray-57">{{ $t('info.imageFormat') }}</span>
            </div>
            <Button v-if="isCreate" class="self-end" size="md" @click="() => inputImage.click()">{{
              $t('common.append')
            }}</Button>
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
            <div v-for="file in uploadFiles" class="relative overflow-hidden rounded-sm pb-[56%]" :key="file.id">
              <div class="absolute top-0 h-full w-full">
                <EncryptImage v-if="file.status === UPLOAD_STATUS.SAVE" :src="file.url" cover></EncryptImage>
                <img v-else :src="file.result" class="h-full w-full rounded-sm object-cover" />
              </div>
              <div
                class="absolute top-0 h-full w-full origin-right bg-white opacity-60 will-change-transform"
                :style="{ transform: `scaleX(${1 - file.progress})` }"
              ></div>
              <div
                v-if="isCreate"
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
                @click="removeUploadFile(file.id)"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
          </div>
          <div v-if="uploadError" class="text-left text-sm font-normal not-italic leading-md text-warning">
            {{ uploadError }}
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
          leading
          resize
        ></TextareaWrap>

        <!-- Tag -->
        <TagEditor v-model="publishParams.tags" :err-msg="tagError"></TagEditor>

        <!-- 誰可以看到 -->
        <div class="flex flex-col space-y-10">
          <label class="text-left text-base leading-md">{{ $t('label.pickPerm') }}</label>
          <OptionsPicker v-model="publishParams.perm" :options="permOptions"></OptionsPicker>
        </div>

        <!-- 指定訂閱組 -->
        <div v-if="publishParams.perm === FEED_PERM.SUB" class="flex flex-col space-y-10">
          <label class="flex items-end space-x-5 text-left text-base leading-md">
            <span>{{ $t('label.pickSub') }}</span>
            <span class="grow text-sm leading-3 text-gray-57">{{ $t('label.pickPermSub') }}</span>
            <span class="cursor-pointer text-primary" @click="toggleSubsAll">{{
              isSubSelectAll ? $t('label.unpickAll') : $t('label.pickAll')
            }}</span>
          </label>
          <OptionsPicker v-model="publishParams.subs" :options="subOptions" can-pick-none></OptionsPicker>
          <div v-if="subsError" class="text-left text-sm font-normal not-italic leading-md text-warning">
            {{ subsError }}
          </div>
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

        <Button :loading="publishing" :disabled="isUploading" @click="publish">{{
          isUploading ? $t('info.waitUploading') : $t('common.publish')
        }}</Button>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { computed, onActivated, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import { useMineStore } from '@/store/mine'
import { useModalStore } from '@/store/modal'
import { usePublishStore } from '@/store/publish'
import { useSubPlanStore } from '@/store/sub-plan'
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

const { isMobile } = storeToRefs(useAppStore())

const { t: $t } = useI18n()

const publishStore = usePublishStore()
const { uploadFiles, publishTimeOpen, isCreate, isUpdate, isVideo, isImage, isEditing, isUploading, noUploadFiles } =
  storeToRefs(publishStore)
const {
  publishParams,
  startUpload,
  clear,
  changeVideoFile,
  addImageFile,
  removeUploadFile,
  cancelUpload,
  hasChangeEditContent,
} = publishStore

const { alert, confirm } = useModalStore()

const accountStore = useAccountStore()
const { userData } = storeToRefs(accountStore)

const { open: openSubPlanDialog } = useSubPlanStore()

const dialogStore = useDialogStore()
const { subPlanDialog } = storeToRefs(dialogStore)

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
        // 沒有訂閱計畫，彈窗讓他新增
        if (userData.value.subscription_list.length === 0) {
          openCreateSubConfirm()
        }

        await startUpload(video)
      } catch (e) {
        console.error(e)
        clear()
        back()
      }
    }
    if (!v) {
      resetErrorMsg()
    }
  },
  { immediate: true },
)
watch(subPlanDialog, (v) => {
  if (!v && userData.value.subscription_list.length === 0 && isEditing.value) {
    openCreateSubConfirm()
  }
})

const appStore = useAppStore()
const { categories } = storeToRefs(appStore)

const permOptions = ref([
  { label: $t('label.sub'), value: FEED_PERM.SUB },
  { label: $t('label.buy'), value: FEED_PERM.BUY },
  { label: $t('label.private'), value: FEED_PERM.PRI },
])

const subOptions = computed(() => userData.value?.subscription_list.map((sub) => ({ label: sub.name, value: sub.id })))
const isSubSelectAll = computed(() => publishParams.subs.length === subOptions.value.length)
function toggleSubsAll() {
  if (isSubSelectAll.value) {
    publishParams.subs.length = 0
  } else {
    publishParams.subs = subOptions.value.map((o) => o.value)
  }
}

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
    uploadError.value = ''
  }
}

function onImageFile(evt) {
  const files = evt.target.files
  if (files.length > 0) {
    addImageFile(files)
  }
}

function afterActionSuccess(toMinePostTab) {
  reloadPost()
  clear()

  if (toMinePostTab) {
    to('mine-post', { query: { t: toMinePostTab } })
  } else {
    back()
  }
}

function openCreateSubConfirm() {
  confirm({
    title: 'title.noSubPlan',
    content: $t('content.createSubBeforePost'),
    async confirmAction() {
      openSubPlanDialog()
    },
    cancelAction() {
      clear()
      back()
    },
    confirmText: $t('label.goToSet'),
  })
}

function onDelete() {
  confirm({
    title: 'info.whetherDelArticle',
    async confirmAction() {
      try {
        await useRequest('Article.delete', { params: { article_id: publishParams.id }, immediate: true })
        afterActionSuccess()
      } catch (e) {
        return e.message
      }
    },
    cancelAction() {},
  })
}

const cancel = (id, status) => {
  confirm({
    title: status === UPLOAD_STATUS.DONE ? 'title.cancelFile' : 'title.cancelUpload',
    content: status === UPLOAD_STATUS.DONE ? $t('content.cancelFile') : $t('content.cancelUpload'),
    confirmAction() {
      cancelUpload()
      removeUploadFile(id)
    },
    cancelAction() {},
  })
}

const preClear = () => {
  if (hasChangeEditContent()) {
    return new Promise((resolve, reject) => {
      confirm({
        title: 'title.cancelPublish',
        content: $t('content.cancelPublish'),
        confirmAction: resolve,
        cancelAction: reject,
      })
    })
  }
  return Promise.resolve()
}

function handleClear() {
  clear()
}

const verifyIsAllowStateToActivePage = () => {
  if (!isEditing.value) to('home')
}

onBeforeMount(verifyIsAllowStateToActivePage)
onActivated(verifyIsAllowStateToActivePage)

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
    } else if (publishParams.perm === FEED_PERM.PRI) {
      toMinePostTab = POST_TAB_TYPE.PRI
    }
  }

  publishing.value = true
  useRequest('Article.publish', { params: data, immediate: true })
    .then(() => {
      alert({
        title: 'title.publishSuccess',
        confirmAction() {
          afterActionSuccess(toMinePostTab)
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
    data.display_at = Math.floor(publishParams.postTime.getTime() / 1000)
  }

  return data
}

const { Yup, parseError } = useYup()
const uploadError = ref('')
const titleSchema = Yup.string().required()
const titleError = ref('')
const contentSchema = Yup.string().required()
const contentError = ref('')
const tagError = ref('')
const subsSchema = Yup.array().min(1)
const subsError = ref('')
const priceSchema = Yup.number().positive().max(90)
const priceError = ref('')
function validation() {
  let result = true

  uploadError.value = ''
  if (uploadFiles.value.length === 0) {
    uploadError.value = $t('yup.file.required')
    result = false
  }

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

  subsError.value = ''
  if (publishParams.perm === FEED_PERM.SUB) {
    try {
      subsSchema.validateSync(publishParams.subs)
    } catch (e) {
      subsError.value = parseError(e)
      result = false
    }
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
function resetErrorMsg() {
  uploadError.value = ''
  titleError.value = ''
  contentError.value = ''
  tagError.value = ''
  subsError.value = ''
  priceError.value = ''
}
</script>
