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
            {{ `${uploadFiles.length + 3}/${IMAGE_LIMIT_COUNT}` }}
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
          <div
            v-for="(item, index) in appConfig.subscription_images"
            :key="index"
            :class="[
              {
                ' shadow-xl border-primary': selDefaultItem === item,
                'border-transparent': selDefaultItem !== item,
              },
            ]"
            class="relative overflow-hidden rounded-sm border-2 pb-[64%]"
          >
            <div @click="selDefaultImg(item)" class="absolute top-0 h-full w-full cursor-pointer">
              <EncryptImage :src="item" cover rounded></EncryptImage>
            </div>
          </div>
          <div
            v-for="(item, index) in uploadFiles"
            :key="index"
            :class="[
              {
                ' shadow-xl border-primary': selUploadItem === item.result,
                'border-transparent': selUploadItem !== item.result,
              },
            ]"
            class="relative overflow-hidden rounded-sm border-2 pb-[64%]"
          >
            <div @click="selUploadImg(item)" class="absolute top-0 h-full w-full cursor-pointer">
              <EncryptImage :src="item.result" cover rounded></EncryptImage>
            </div>
            <div
              class="absolute top-0 h-full w-full origin-right bg-white opacity-60 will-change-transform"
              :style="{ transform: `scaleX(${1 - item.progress})` }"
            ></div>
            <div
              class="absolute right-10 top-10 flex h-15 w-15 cursor-pointer items-center justify-center rounded-full bg-white"
              @click="removeUploadFile(index)"
            >
              <Icon name="close" size="10"></Icon>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-30 flex flex-col space-y-20">
        <InputWrap
          v-model="credential.subPlanName.value"
          :err-msg="credential.subPlanName.error"
          :label="$t('label.subPlanName')"
          :placeholder="$t('placeholder.subPlanName')"
        ></InputWrap>
        <TextareaWrap
          v-model="credential.subPlanContent.value"
          :err-msg="credential.subPlanContent.error"
          :label="$t('label.subPlanCtn')"
          :placeholder="$t('placeholder.subPlanCtn')"
          :line="8"
        ></TextareaWrap>
        <InputWrap
          v-model="credential.subPlanPrice.value"
          :err-msg="credential.subPlanPrice.error"
          :label="$t('label.subPlanPrice')"
          :sublabel="$t('label.priceSub')"
          :placeholder="'$ 14.99'"
          step
          @keyup="priceValidate"
        ></InputWrap>
        <RegionSelector v-model="effectDays" :options="effectDayOptions" :label="$t('label.daySet')" />
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
            <RegionSelector
              v-model="unlockPrevFeedDays"
              :options="unlockPrevOptions"
              :label="$t('content.subUnlockDayAfter')"
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

<script setup>
import { computed, nextTick, onActivated, onDeactivated, reactive, ref, watch } from 'vue'
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
import RegionSelector from './RegionSelector.vue'

const { t: $t } = useI18n()

const scrollRef = ref(null)

const showAdvanced = ref(false)
const toggleAdvanced = () => (showAdvanced.value = !showAdvanced.value)
whenever(showAdvanced, () => nextTick(() => (scrollRef.value.scrollTop = scrollRef.value.scrollHeight)))

const accountStore = useAccountStore()
const { updateUserData } = accountStore
const { isDesktop } = storeToRefs(useAppStore())

const publishStore = usePublishStore()
const { isEditing } = storeToRefs(publishStore)

const serverError = ref('')

const unlockPrevOptions = [
  { label: $t('info.allDays'), type: '', value: 1000 },
  { label: $t('info.within30days'), type: '', value: 30 },
  { label: $t('info.within90days'), type: '', value: 90 },
  { label: $t('info.within360days'), type: '', value: 360 },
]
const unlockPrevFeedDays = ref(0)
watch(unlockPrevFeedDays, (v) => {
  const i18nKey = v > 1000 ? 'yup.number.max' : v <= 0 ? 'yup.number.positive' : ''
  const i18nValue = v > 1000 ? { max: 1000 } : v <= 0 ? {} : {}
  serverError.value = i18nKey ? $t(i18nKey, i18nValue) : ''
})

const effectDayOptions = [
  { label: $t('info.number30days'), type: '', value: 30 },
  { label: $t('info.number60days'), type: '', value: 60 },
  { label: $t('info.number90days'), type: '', value: 90 },
]
const effectDays = ref(0)
watch(effectDays, (v) => {
  const i18nKey = v <= 0 ? 'yup.number.positive' : v < 30 ? 'yup.number.min' : v > 365 ? 'yup.number.max' : ''
  const i18nValue = v <= 0 ? {} : v < 30 ? { min: 30 } : v > 365 ? { max: 365 } : {}
  serverError.value = i18nKey ? $t(i18nKey, i18nValue) : ''
})

const { Yup, validate } = useYup()
const subPlanStore = useSubPlanStore()
const { alert, confirm } = useModalStore()
const { open: openMessage } = usePopupMessageStore()
const { back, close, clearCurrentSubItem } = subPlanStore
const {
  history,
  // currentSubList,
  // currentIndex,
  currentSubItem,
  status,
  subList,
  addSubPlan,
  subUnlockDayAfter,
  subId,
  subPicture,
  uploadFiles,
  selDefaultItem,
  selUploadItem,
} = storeToRefs(subPlanStore)

const credential = reactive({
  subPlanName: {
    value: currentSubItem.value?.name || '',
    error: '',
    check: false,
    schema: Yup.string().required().max(32),
  },
  subPlanContent: {
    value: currentSubItem.value?.content || '',
    error: '',
    check: false,
    schema: Yup.string().required().max(300),
  },
  subPlanPrice: {
    value: currentSubItem.value?.price || 0,
    error: '',
    check: false,
    schema: Yup.number()
      .typeError($t('yup.number.round'))
      .test('is-decimal', $t('yup.number.twoDecimal'), (value) => {
        const decimalPart = (value + '').split('.')[1]
        return !decimalPart || decimalPart.length <= 2
      })
      .required($t('yup.number.positive'))
      .max(999, $t('yup.number.max', { max: 999 }))
      .min(1, $t('yup.number.min', { min: 1 })),
  },
})
const showBack = computed(() => history.value.length > 0)

async function priceValidate() {
  try {
    await validate(credential.subPlanPrice.schema, credential.subPlanPrice)
  } catch (e) {
    credential.subPlanPrice.error = e
  }
}

onActivated(() => {
  console.log(`[DEBUG] SubPlanSet mounted`, currentSubItem.value)

  credential.subPlanName.value = currentSubItem.value.name
  credential.subPlanContent.value = currentSubItem.value.content
  credential.subPlanPrice.value = currentSubItem.value.price

  subUnlockDayAfter.value = currentSubItem.value.unlock_day_after_subscribe
  unlockPrevFeedDays.value = currentSubItem.value.unlock_day_after_subscribe

  effectDays.value = currentSubItem.value.expire_days

  subId.value = currentSubItem.value.id
  subPicture.value = currentSubItem.value.picture
  selUploadItem.value = currentSubItem.value.picture
  selDefaultItem.value = currentSubItem.value.picture
  status.value = currentSubItem.value.status

  subPicture.value && uploadFiles.value.push({ result: subPicture.value, progress: 1 })
})

onDeactivated(() => {
  console.log(`[DEBUG] SubPlanSet unmounted`)
  clearError()
  resetAllData()
  showAdvanced.value = false
})

function clearError() {
  resetFormError('subPlanName', 'subPlanContent', 'subPlanPrice')
  serverError.value = ''
}

function resetAllData() {
  clearCurrentSubItem()
  uploadFiles.value = []
  selUploadItem.value = null
  selDefaultItem.value = appConfig.subscription_images[0]
  resetForm('subPlanName', 'subPlanContent', 'subPlanPrice')
  subUnlockDayAfter.value = ''
  subPicture.value = ''
  status.value = SUB_PLAN_STATUS.ENABLE
}

// 重新進入任一設定頁，會監聽數據是否改變了
// watch(currentIndex, (newIndex) => {
//   if (newIndex !== null && currentSubList.value[newIndex]) {
//     credential.subPlanName.value = currentSubList.value[newIndex].name
//     credential.subPlanContent.value = currentSubList.value[newIndex].content
//     credential.subPlanPrice.value = currentSubList.value[newIndex].price
//     subPicture.value = currentSubList.value[newIndex]?.picture
//     selUploadItem.value = currentSubList.value[newIndex]?.picture
//     status.value = currentSubList.value[newIndex]?.status
//     subId.value = currentSubItem.value?.id
//     resetFormError('subPlanName', 'subPlanContent', 'subPlanPrice')
//     serverError.value = ''
//   }
//   if (newIndex !== null && subList.value[newIndex]) {
//     subId.value = subList.value[newIndex].id
//     subUnlockDayAfter.value = subList.value[newIndex].unlock_day_after_subscribe
//   }
// })

// watch(addSubPlan, (newAddSubPlan) => {
//   if (newAddSubPlan) {
//     uploadFiles.value = []
//     selUploadItem.value = null
//     selDefaultItem.value = appConfig.subscription_images[0]
//     resetForm('subPlanName', 'subPlanContent', 'subPlanPrice')
//     subUnlockDayAfter.value = ''
//     subPicture.value = ''
//   } else {
//     credential.subPlanName.value = currentSubItem.value.name
//     credential.subPlanContent.value = currentSubItem.value.content
//     credential.subPlanPrice.value = currentSubItem.value.price
//     selDefaultItem.value = null
//     selUploadItem.value = currentSubItem.value.picture
//   }
//   resetFormError('subPlanName', 'subPlanContent', 'subPlanPrice')
//   serverError.value = ''
// })

// watch(subPicture, (newSubPicture) => {
//   if (!addSubPlan.value && newSubPicture) {
//     selDefaultItem.value = null
//     selUploadItem.value = newSubPicture
//     uploadFiles.value = []
//     uploadFiles.value.push({ result: newSubPicture, progress: 1 })
//   }
// })

// watch(subList, (newSubList) => {
//   if (newSubList && currentSubList.value.length > 0 && currentSubList.value.length !== currentIndex.value) {
//     credential.subPlanName.value = newSubList[currentIndex.value].name
//     credential.subPlanContent.value = newSubList[currentIndex.value].content
//     credential.subPlanPrice.value = newSubList[currentIndex.value].price
//     subUnlockDayAfter.value = newSubList[currentIndex.value].unlock_day_after_subscribe
//     subPicture.value = newSubList[currentIndex.value].picture
//     selUploadItem.value = subPicture.value
//     subId.value = newSubList[currentIndex.value].id
//   }
// })

const selDefaultImg = (item) => {
  selDefaultItem.value = item
  if (selUploadItem.value !== null) {
    selUploadItem.value = null
  }
}
const selUploadImg = (item) => {
  selUploadItem.value = item.result
  if (selDefaultItem.value !== null) {
    selDefaultItem.value = null
  }
}

const inputImage = ref(null)
const { appConfig } = useAppStore()
const handleFileUpload = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  const totalFiles = uploadFiles.value.length + files.length

  if (totalFiles > 7) {
    alert({
      title: 'info.upToTen',
    })
    return
  }

  for (const file of files) {
    try {
      const progress = ref(0)
      const url = await uploadImage(file, (p) => {
        progress.value = p
      })
      uploadFiles.value.push({ result: appConfig.config.img_url + url, progress })
      selUploadItem.value = appConfig.config.img_url + url
      selDefaultItem.value = null
    } catch (error) {
      console.error('label.uploadErr', error)
    }
  }
}
const removeUploadFile = (index) => uploadFiles.value.splice(index, 1)

function onDelete() {
  confirm({
    size: 'sm',
    title: 'beCreator.title.reConfirm',
    content: $t('content.delSubPlan'),
    confirmAction: deleteSubPlan,
  })
}
const deleteSubPlan = async () => {
  const { execute: subPlanDel } = useRequest('Subscription.bulkDel')
  try {
    await subPlanDel({ ids: subId.value })
    subList.value = subList.value.filter((item) => item.id !== subId.value)
    updateUserData({ subscription_list: subList.value })
    back()
    openMessage('title.delSuccess')
    serverError.value = ''
  } catch (e) {
    serverError.value = e.message
  }
}

const onSubmit = async () => {
  const data = makeReqData()
  const { execute: subPlanUpdate } = useRequest('Subscription.update')
  const { execute: subPlanCreate } = useRequest('Subscription.create')
  if (addSubPlan.value) {
    if (subList.value.length === 10) {
      openMessage('content.maxSubPlan')
    } else {
      try {
        await Promise.all([
          validate(credential.subPlanName.schema, credential.subPlanName),
          validate(credential.subPlanContent.schema, credential.subPlanContent),
          validate(credential.subPlanPrice.schema, credential.subPlanPrice),
        ])
        const response = ref(null)
        const resId = await subPlanCreate(data)
        data.id = resId
        response.value = data
        subList.value.unshift(response.value)
        updateUserData({ subscription_list: subList.value })
        openMessage('title.publishSuccess')
        uploadFiles.value = []
        resetForm('subPlanName', 'subPlanContent', 'subPlanPrice')
        subUnlockDayAfter.value = ''
        serverError.value = ''
        back()

        // 正在編輯帖子的話代表是沒有任何訂閱計畫時點擊發布帖子後被引導過來這的
        // 這時候要直接關閉繼續編輯帖子
        if (isEditing.value) {
          close()
        }
      } catch (e) {
        serverError.value = e.message
      }
    }
  } else {
    try {
      await Promise.all([
        validate(credential.subPlanName.schema, credential.subPlanName),
        validate(credential.subPlanContent.schema, credential.subPlanContent),
        validate(credential.subPlanPrice.schema, credential.subPlanPrice),
      ])
      await subPlanUpdate(data)
      const index = subList.value.findIndex((item) => item.id === subId.value)
      if (index !== -1) {
        subList.value[index] = data
      }
      updateUserData({ subscription_list: subList.value })
      openMessage('title.publishSuccess')
      serverError.value = ''
      back()
    } catch (e) {
      serverError.value = e.message
    }
  }
}

function makeReqData() {
  const payload = {
    name: credential.subPlanName.value,
    content: credential.subPlanContent.value,
    price: credential.subPlanPrice.value,
    unlock_day_after_subscribe: unlockPrevFeedDays.value,
    expire_days: effectDays.value,
    status: status.value,
  }

  subId.value && (payload.id = subId.value)

  const picture = selDefaultItem.value || selUploadItem.value
  picture && (payload.picture = picture)

  return payload
}

const resetForm = (...keys) => {
  keys.forEach((key) => {
    credential[key].value = ''
    credential[key].check = false
  })
}
const resetFormError = (...keys) => {
  keys.forEach((key) => {
    credential[key].error = ''
  })
}
</script>
