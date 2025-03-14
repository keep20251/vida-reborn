<script setup>
import debounce from 'lodash/debounce'
import { computed, nextTick, onActivated, onDeactivated, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import { usePublishStore } from '@/store/publish'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import useRequest from '@use/request'
import { useYup } from '@use/validator/yup'
import { SUB_PLAN_STATUS } from '@const'
import { IMAGE_LIMIT_COUNT } from '@const/publish'
import uploadImage from '@/http/upload/uploadImage'
import RadioGroup from '../form/RadioGroup.vue'

const { t: $t } = useI18n()

const accountStore = useAccountStore()
const { updateUserData } = accountStore

const publishStore = usePublishStore()
const { isEditing } = storeToRefs(publishStore)

const { Yup, validate } = useYup()
const { alert, confirm } = useModalStore()
const { open: openMessage } = usePopupMessageStore()

const subPlanStore = useSubPlanStore()
const { back, close, clearCurrentSubItem } = subPlanStore
const { history, currentSubItem, subList, addSubPlan } = storeToRefs(subPlanStore)

const scrollRef = ref(null)
const showAdvanced = ref(false)
const setAdvanced = (v) => (showAdvanced.value = v)
const toggleAdvanced = () => setAdvanced(!showAdvanced.value)
const disableAdvanced = () => setAdvanced(false)
whenever(showAdvanced, () => nextTick(() => (scrollRef.value.scrollTop = scrollRef.value.scrollHeight)))

const inputImage = ref(null)
const appStore = useAppStore()
const { appConfig } = appStore
const { isDesktop } = storeToRefs(appStore)

const serverError = ref('')
const showBack = computed(() => history.value.length > 0)

const unlockPrevOptions = [
  { label: $t('info.allDays'), type: '', value: 1000 },
  { label: $t('info.within30days'), type: '', value: 30 },
  { label: $t('info.within90days'), type: '', value: 90 },
  { label: $t('info.within360days'), type: '', value: 360 },
]

const effectDayOptions = [
  { label: $t('info.number30days'), type: '', value: 30 },
  { label: $t('info.number60days'), type: '', value: 60 },
  { label: $t('info.number90days'), type: '', value: 90 },
]

const initSubPlan = {
  id: 0,
  name: '',
  content: '',
  price: 0,
  unlockDayAfter: 30,
  expireDays: 30,
  uploadImageList: [],
  defaultImage: '',
  status: SUB_PLAN_STATUS.ENABLE,
}

const subPlan = reactive({
  id: 0,
  name: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required().max(32),
  },
  content: {
    value: '',
    error: '',
    check: false,
    schema: Yup.string().required().max(300),
  },
  price: {
    value: 0,
    error: '',
    check: false,
    schema: Yup.number().typeError({ key: 'yup.number.round', values: {} }).required().max(999).min(1).floatTwo(),
  },
  unlockDayAfter: {
    value: 30,
    error: '',
    check: false,
    schema: Yup.number().required().max(1000).positive(0).integer(),
  },
  expireDays: {
    value: 30,
    error: '',
    check: false,
    schema: Yup.number().required().positive().min(30).max(365).integer(),
  },
  uploadImageList: [],
  defaultImage: '',
  status: SUB_PLAN_STATUS.ENABLE,
})

const uploadImageList = computed(() => {
  const coverImageList = appConfig.subscription_images.map((path) => ({
    result: path,
    progress: 1,
    removable: false,
  }))
  return [...coverImageList, ...subPlan.uploadImageList]
})

const validateFnList = Object.entries(subPlan)
  .filter(([_, property]) => !!property?.schema)
  .reduce((acc, [key, property]) => {
    acc[key] = debounce(() => validate(property.schema, property), 1000)
    return acc
  }, {})

console.log(`[DEBUG] validations`, validateFnList)

function setupPlan() {
  subPlan.id = currentSubItem.value.id
  subPlan.name.value = currentSubItem.value.name
  subPlan.content.value = currentSubItem.value.content
  subPlan.price.value = currentSubItem.value.price
  subPlan.unlockDayAfter.value = currentSubItem.value.unlock_day_after_subscribe
  subPlan.expireDays.value = currentSubItem.value.expire_days
  subPlan.status = currentSubItem.value.status
  subPlan.defaultImage = currentSubItem.value.picture
  subPlan.uploadImageList = currentSubItem.value.picture
    ? [{ result: currentSubItem.value.picture, progress: 1, removable: true }]
    : []
}

onActivated(setupPlan)
onDeactivated(resetAllData)

function resetValues() {
  Object.entries(subPlan).forEach(([key, value]) => {
    if (!!value?.check && !!value?.error) {
      value.value = initSubPlan[key]
      value.check = false
      value.error = ''
    } else {
      value = initSubPlan[key]
    }
  })
}

const setServerError = (msg) => (serverError.value = msg)
const clearServerError = () => setServerError('')

function resetAllData() {
  resetValues()
  clearCurrentSubItem()
  clearServerError()
  disableAdvanced()
}

const setDefaultImage = (item) => (subPlan.defaultImage = item.result)
const removeUploadFile = (item) => {
  const index = subPlan.uploadImageList.findIndex((i) => i.result === item.result)
  subPlan.uploadImageList.splice(index, 1)
}

const handleFileUpload = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  if (subPlan.uploadImageList.length + files.length > 7) {
    alert({ title: 'info.upToTen' })
    return
  }

  const fileList = Array.from(files)
  const promises = fileList.map((file) => uploadImageFile(file))
  await Promise.all(promises).catch((e) => console.error('label.uploadErr', e))
}

async function uploadImageFile(file) {
  let progress = 0
  const url = await uploadImage(file, (p) => (progress = p))
  const imageItem = { result: appConfig.config.img_url + url, progress, removable: true }
  subPlan.uploadImageList.push(imageItem)
  setDefaultImage(imageItem)
}

function onDelete() {
  confirm({
    size: 'sm',
    title: 'beCreator.title.reConfirm',
    content: $t('content.delSubPlan'),
    confirmAction: deletePlan,
  })
}
async function deletePlan() {
  try {
    await useRequest('Subscription.bulkDel', { params: { ids: subPlan.id }, immediate: true })
    const reviseList = subList.value.filter((item) => item.id !== subPlan.id)
    updateUserData({ subscription_list: reviseList })
    back()
    openMessage('title.delSuccess')
    clearServerError()
  } catch (e) {
    setServerError(e.message)
  }
}

const SUBSCRIPTION_MAXIUM = 10

async function onSubmit() {
  try {
    if (addSubPlan.value && subList.value.length >= SUBSCRIPTION_MAXIUM) {
      openMessage('content.maxSubPlan')
      return
    }

    await validateSchema()
    const maybeId = await doRequest(addSubPlan.value)
    addSubPlan.value && (subPlan.id = maybeId)

    const _subItem = transferToSubItem()

    const reviseList = addSubPlan.value
      ? [_subItem, ...subList.value]
      : subList.value.map((item) => (item.id === _subItem.id ? _subItem : item))

    updateUserData({ subscription_list: reviseList })
    openMessage('title.publishSuccess')

    const onComplete = addSubPlan.value ? back : close
    onComplete()

    // 正在編輯帖子的話代表是沒有任何訂閱計畫時點擊發布帖子後被引導過來這的，這時候要直接關閉繼續編輯帖子
    addSubPlan.value && isEditing.value && close()

    resetValues()
  } catch (e) {
    console.error(e)
  }
}

function validateSchema() {
  const promises = Object.values(subPlan)
    .filter((property) => !!property?.schema)
    .map((property) => validate(property.schema, property))

  return Promise.all(promises)
}

async function doRequest(requestForAdd = true) {
  try {
    const apiReq = requestForAdd ? 'Subscription.create' : 'Subscription.update'
    const payload = makePayload()
    await useRequest(apiReq, { params: payload, immediate: true })
  } catch (e) {
    setServerError(e.message)
  }
}

function makePayload() {
  const payload = {
    name: subPlan.name.value,
    content: subPlan.content.value,
    price: subPlan.price.value,
    unlock_day_after_subscribe: subPlan.unlockDayAfter.value,
    status: subPlan.status,
  }

  subPlan.id && subPlan.id > 0 && (payload.id = subPlan.id)
  subPlan.defaultImage && (payload.picture = subPlan.defaultImage)

  // 訂閱有效天數僅在新增時才能設定
  addSubPlan.value && (payload.expire_days = subPlan.expireDays.value)

  return payload
}

function transferToSubItem() {
  const subItem = {
    id: subPlan.id,
    name: subPlan.name.value,
    content: subPlan.content.value,
    price: subPlan.price.value,
    unlock_day_after_subscribe: subPlan.unlockDayAfter.value,
    expire_days: subPlan.expireDays.value,
    picture: subPlan.defaultImage,
    status: subPlan.status,
  }
  return subItem
}
</script>
<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative rounded-t-xl py-30 text-center">
      <div class="absolute left-0 top-1/3 px-20 py-4">
        <button @click="back" :history="history" :show-back="showBack">
          <Icon name="back" size="20"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">
        {{ addSubPlan ? $t('label.add') : $t('label.edit') }}{{ $t('info.subscribeSetting') }}
      </div>
      <button v-if="!addSubPlan" @click="onDelete" class="absolute right-0 top-1/3 px-20 py-4">
        <Icon name="bin" size="20"></Icon>
      </button>
    </div>
    <div
      class="mr-10 max-h-[65vh] overflow-y-scroll pl-25"
      :class="{ 'hover-scrollbar pr-5': isDesktop, 'scrollbar pr-10': !isDesktop }"
      ref="scrollRef"
    >
      <div class="flex flex-col space-y-10">
        <div class="flex flex-row items-start space-x-5">
          <div class="text-base font-normal leading-md">{{ $t('content.style') }}</div>
          <div class="text-sm text-gray-57">
            {{ `${subPlan.uploadImageList.length + 3}/${IMAGE_LIMIT_COUNT}` }}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex max-w-[60%] flex-col space-y-2 text-sm text-gray-57">
            <div class="leading-3">{{ $t('info.uploadRule') }}</div>
          </div>
          <div class="">
            <Button class="min-w-[6rem] px-11 py-8 !font-bold" contrast size="sm" @click="() => inputImage.click()">
              {{ $t('content.subStyle') }}
            </Button>
            <input
              ref="inputImage"
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              @change="(event) => handleFileUpload(event)"
              hidden
              multiple
            />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-10">
          <template v-for="(imageItem, index) in uploadImageList" :key="index">
            <div
              class="relative overflow-hidden rounded-sm border-2 pb-[64%]"
              :class="{
                'shadow-xl border-primary': subPlan.defaultImage === imageItem.result,
                'border-transparent': subPlan.defaultImage !== imageItem.result,
              }"
            >
              <div @click="setDefaultImage(imageItem)" class="absolute top-0 h-full w-full cursor-pointer">
                <EncryptImage :src="imageItem.result" cover rounded></EncryptImage>
              </div>
              <div
                class="absolute top-0 h-full w-full origin-right bg-white opacity-60 will-change-transform"
                :style="{ transform: `scaleX(${1 - imageItem.progress})` }"
              ></div>
              <div
                v-if="imageItem.removable"
                class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
                @click="removeUploadFile(imageItem)"
              >
                <Icon name="close" size="10"></Icon>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="mt-30 flex flex-col space-y-20">
        <InputWrap
          v-model="subPlan.name.value"
          :err-msg="subPlan.name.error"
          :label="$t('label.subPlanName')"
          :placeholder="$t('placeholder.subPlanName')"
          @update:model-value="validateFnList.name"
        ></InputWrap>
        <TextareaWrap
          v-model="subPlan.content.value"
          :err-msg="subPlan.content.error"
          :label="$t('label.subPlanCtn')"
          :placeholder="$t('placeholder.subPlanCtn')"
          :line="8"
          @update:model-value="validateFnList.content"
        ></TextareaWrap>
        <InputWrap
          v-model="subPlan.price.value"
          :err-msg="subPlan.price.error"
          :label="$t('label.subPlanPrice')"
          :sublabel="$t('label.priceSub')"
          placeholder="$14.99"
          step
          @update:model-value="validateFnList.price"
        ></InputWrap>
        <RadioGroup
          v-if="addSubPlan"
          v-model="subPlan.expireDays.value"
          radio-key="expire-days"
          :options="effectDayOptions"
          :label="$t('label.daySet')"
          :err-msg="subPlan.expireDays.error"
          @update:model-value="validateFnList.expireDays"
        />
        <div class="flex w-full justify-end">
          <span class="cursor-pointer text-base text-primary" @click="toggleAdvanced">
            {{ $t('common.advancedOption') }}
          </span>
        </div>
        <transition
          enter-active-class="transition duration-150 ease-in"
          enter-from-class="transform scale-y-0 -translate-y-50"
          enter-to-class="transform scale-y-100  translate-y-0"
          leave-active-class="transition duration-150 ease-out"
          leave-from-class="transform translate-y-0 scale-y-100"
          leave-to-class="transform -translate-y-50 scale-y-0"
        >
          <div v-show="showAdvanced">
            <RadioGroup
              v-model="subPlan.unlockDayAfter.value"
              radio-key="unlock-prev-feed-days"
              :options="unlockPrevOptions"
              :label="$t('content.subUnlockDayAfter')"
              :err-msg="subPlan.unlockDayAfter.error"
              @update:model-value="validateFnList.unlockDayAfter"
            />
          </div>
        </transition>
      </div>
    </div>
    <div class="flex flex-col space-y-10 px-25 py-30">
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
      <Button @click="onSubmit" size="lg">{{ addSubPlan ? $t('label.submit') : $t('common.save') }}</Button>
    </div>
  </div>
</template>
