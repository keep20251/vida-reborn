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
          <div v-show="showAdvanced" class="grid space-y-10">
            <label class="text-left text-base font-normal not-italic leading-md">{{
              $t('content.subUnlockDayAfter')
            }}</label>
            <div class="flex flex-wrap space-y-5">
              <InputRadio
                v-model="radioValue"
                id="radioOption4"
                :label="$t('info.allDays')"
                :value="1000"
                name="radio"
                class="mr-30"
              />
              <InputRadio
                v-model="radioValue"
                id="radioOption1"
                :label="$t('info.within30days')"
                :value="30"
                name="radio"
                class="mr-30"
              />
              <InputRadio
                v-model="radioValue"
                id="radioOption2"
                :label="$t('info.within90days')"
                :value="90"
                name="radio"
                class="mr-30"
              />
              <InputRadio
                v-model="radioValue"
                id="radioOption3"
                :label="$t('info.within360days')"
                :value="360"
                name="radio"
                class="mr-30"
              />
              <div class="flex items-center">
                <InputRadio
                  v-model="radioValue"
                  id="radioOption5"
                  :label="$t('info.customDays')"
                  :value="'custom'"
                  name="radio"
                /><InputWrap
                  v-if="radioValue === 'custom'"
                  :placeholder="$t('yup.number.value')"
                  v-model="customValue"
                  class="ml-10"
                  number
                ></InputWrap>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="px-25 py-30">
      <Button @click="onSubmit" size="lg">{{ addSubPlan ? $t('label.submit') : $t('common.save') }}</Button>
      <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { usePopupMessageStore } from '@/store/popup-message'
import { usePublishStore } from '@/store/publish'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputRadio from '@comp/form/InputRadio.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import useRequest from '@use/request'
import { useYup } from '@use/validator/yup'
import { SUB_PLAN_STATUS } from '@const'
import { IMAGE_LIMIT_COUNT } from '@const/publish'
import uploadImage from '@/http/upload/uploadImage'

const showAdvanced = ref(false)
const toggleAdvanced = () => (showAdvanced.value = !showAdvanced.value)

const accountStore = useAccountStore()
const { updateUserData } = accountStore
const { isDesktop } = storeToRefs(useAppStore())

const publishStore = usePublishStore()
const { isEditing } = storeToRefs(publishStore)

const serverError = ref('')
const radioValue = ref(0)
const customValue = ref(0)
const subUnlockDayAfterValue = computed(() => {
  if (radioValue.value === 'custom' && customValue.value !== 0) {
    return parseInt(customValue.value)
  } else {
    return radioValue.value
  }
})

const { t: $t } = useI18n()
const { Yup, validate } = useYup()
const subPlanStore = useSubPlanStore()
const { alert, confirm } = useModalStore()
const { open: openMessage } = usePopupMessageStore()
const { back, close } = subPlanStore
const {
  history,
  data,
  index,
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
    value: data.value[index.value]?.name || '',
    error: '',
    check: false,
    schema: Yup.string().required().max(32),
  },
  subPlanContent: {
    value: data.value[index.value]?.content || '',
    error: '',
    check: false,
    schema: Yup.string().required().max(300),
  },
  subPlanPrice: {
    value: data.value[index.value]?.price || 0,
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

onMounted(() => {
  credential.subPlanName.value = data.value[index.value]?.name
  credential.subPlanContent.value = data.value[index.value]?.content
  credential.subPlanPrice.value = data.value[index.value]?.price
  subUnlockDayAfter.value = data.value[index.value]?.unlock_day_after_subscribe
  subId.value = data.value[index.value]?.id
  subPicture.value = data.value[index.value]?.picture
  status.value = data.value[index.value]?.status
})

// 重新進入任一設定頁，會監聽數據是否改變了
watch(index, (newIndex) => {
  if (newIndex !== null && data.value[newIndex]) {
    credential.subPlanName.value = data.value[newIndex].name
    credential.subPlanContent.value = data.value[newIndex].content
    credential.subPlanPrice.value = data.value[newIndex].price
    subPicture.value = data.value[newIndex]?.picture
    selUploadItem.value = data.value[newIndex]?.picture
    status.value = data.value[newIndex]?.status
    subId.value = data.value[index.value]?.id
    resetFormError('subPlanName', 'subPlanContent', 'subPlanPrice')
    serverError.value = ''
  }
  if (newIndex !== null && subList.value[newIndex]) {
    subId.value = subList.value[newIndex].id
    subUnlockDayAfter.value = subList.value[newIndex].unlock_day_after_subscribe
  }
  if (![30, 90, 360].includes(subUnlockDayAfter.value)) {
    radioValue.value = 'custom'
    customValue.value = subUnlockDayAfter.value
  } else {
    radioValue.value = subUnlockDayAfter.value
    customValue.value = 0
  }
})

watch(subUnlockDayAfter, (newSubUnlockDayAfter) => {
  if (![30, 90, 360].includes(newSubUnlockDayAfter)) {
    if (addSubPlan.value) {
      radioValue.value = 1000
    } else {
      radioValue.value = 'custom'
      customValue.value = newSubUnlockDayAfter
    }
  } else {
    radioValue.value = newSubUnlockDayAfter
    customValue.value = 0
  }
})

watch(addSubPlan, (newAddSubPlan) => {
  if (newAddSubPlan) {
    uploadFiles.value = []
    selUploadItem.value = null
    selDefaultItem.value = appConfig.subscription_images[0]
    resetForm('subPlanName', 'subPlanContent', 'subPlanPrice')
    subUnlockDayAfter.value = ''
    subPicture.value = ''
  } else {
    credential.subPlanName.value = data.value[index.value].name
    credential.subPlanContent.value = data.value[index.value].content
    credential.subPlanPrice.value = data.value[index.value].price
    selDefaultItem.value = null
    selUploadItem.value = data.value[index.value].picture
  }
  resetFormError('subPlanName', 'subPlanContent', 'subPlanPrice')
  serverError.value = ''
})

watch(subPicture, (newSubPicture) => {
  if (!addSubPlan.value && newSubPicture) {
    selDefaultItem.value = null
    selUploadItem.value = newSubPicture
    uploadFiles.value = []
    uploadFiles.value.push({ result: newSubPicture, progress: 1 })
  }
})

watch(subList, (newSubList) => {
  if (newSubList && data.value.length > 0 && data.value.length !== index.value) {
    credential.subPlanName.value = newSubList[index.value].name
    credential.subPlanContent.value = newSubList[index.value].content
    credential.subPlanPrice.value = newSubList[index.value].price
    subUnlockDayAfter.value = newSubList[index.value].unlock_day_after_subscribe
    subPicture.value = newSubList[index.value].picture
    selUploadItem.value = subPicture.value
    subId.value = newSubList[index.value].id
  }
})

watch(customValue, (v) => {
  if (v > 999) {
    serverError.value = $t('yup.number.max', { max: 999 })
  } else if (v <= 0) {
    serverError.value = $t('yup.number.positive')
  } else {
    serverError.value = ''
  }
})

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
const removeUploadFile = (index) => {
  uploadFiles.value.splice(index, 1)
}
function onDelete() {
  confirm({
    size: 'sm',
    title: 'beCreator.title.reConfirm',
    content: $t('content.delSubPlan'),
    confirmAction: () => {
      delSubPlan()
    },
  })
}
const delSubPlan = async () => {
  const { execute: subPlanDel } = useRequest('Subscription.bulkDel')
  try {
    await subPlanDel({ ids: subId.value })
    data.value = data.value.filter((item) => item.id !== subId.value)
    updateUserData({ subscription_list: data.value })
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
  const data = {
    name: credential.subPlanName.value,
    content: credential.subPlanContent.value,
    price: credential.subPlanPrice.value,
    unlock_day_after_subscribe: subUnlockDayAfterValue.value,
  }
  if (subId.value) {
    data.id = subId.value
  }
  if (selDefaultItem.value || selUploadItem.value) {
    data.picture = selDefaultItem.value || selUploadItem.value
  }
  if (status.value === SUB_PLAN_STATUS.DISABLE) {
    data.status = SUB_PLAN_STATUS.DISABLE
  } else if (status.value === SUB_PLAN_STATUS.ENABLE) {
    data.status = SUB_PLAN_STATUS.ENABLE
  }

  return data
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
