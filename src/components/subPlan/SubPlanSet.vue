<template>
  <div class="flex h-full w-full flex-col">
    <div class="relative rounded-t-xl py-30 text-center">
      <div class="absolute left-0 top-1/3 pl-20 pt-4">
        <button @click="back" :history="history" :show-back="showBack">
          <Icon name="back"></Icon>
        </button>
      </div>
      <div class="text-lg font-bold leading-5">
        {{ addSubPlan ? $t('label.add') : $t('label.edit') }}{{ $t('info.subscribeSetting') }}
      </div>
      <button v-if="!addSubPlan" @click="delSubPlan" class="absolute right-0 top-1/3 pr-20 pt-4">
        <Icon name="bin"></Icon>
      </button>
    </div>
    <div class="scrollbar-md mr-15 max-h-[65vh] overflow-y-scroll px-25">
      <div class="flex flex-col space-y-10">
        <div class="flex flex-row items-start space-x-5">
          <div class="text-base font-normal leading-md">{{ $t('content.subStyle') }}</div>
          <div class="text-sm text-gray-57">
            {{ `${uploadFiles.length + 3}/${IMAGE_LIMIT_COUNT}` }}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col space-y-2 text-sm text-gray-57">
            <div class="leading-3">{{ $t('info.recFormat') }}</div>
            <div class="leading-3">{{ $t('info.uploadCapacityLimit') }}</div>
          </div>
          <div>
            <Button @click="() => inputImage.click()" contrast size="md" class="w-max">{{
              $t('content.customStyle')
            }}</Button>
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
                ' border-primary shadow-xl': selDefaultItem === item,
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
                ' border-primary shadow-xl': selUploadItem === item.result,
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
        <InputWrap v-model="subPlanName" :label="'訂閱方案名稱'" :placeholder="'請輸入訂閱方案名稱'"></InputWrap>
        <InputWrap v-model="subPlanContent" :label="'訂閱方案內容'" :placeholder="'請輸入訂閱方案內容'"></InputWrap>
        <InputWrap
          v-model="subPlanPrice"
          :label="'價格'"
          :sublabel="'单位：美金'"
          :placeholder="'9.99'"
          :appendText="'最高设置为90元'"
          :maxLength="5"
        ></InputWrap>
        <InputWrap v-model="subUnlockDayAfter" :label="$t('content.subUnlockDayAfter')" :placeholder="'30'"></InputWrap>
        <!-- <div class="grid space-y-10">
          <label class="text-base font-normal not-italic leading-md text-left">{{
            $t('content.subUnlockDayAfter')
          }}</label>
          <div class="flex flex-wrap space-y-5">
            <InputRadio
              v-model="selectedValue"
              id="radioOption1"
              label="30 day(s)"
              :value="30"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption2"
              label="90 day(s)"
              :value="90"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption3"
              label="360 day(s)"
              :value="360"
              name="radio"
              class="mr-30"
            />
            <InputRadio
              v-model="selectedValue"
              id="radioOption5"
              label="Custom"
              value="custom"
              name="radio"
              :placeholder="'Please enter duration'"
              :includeInputWrap="true"
              @update:modelValue="handleUpdate"
            />
          </div>
        </div> -->
      </div>
    </div>
    <div class="px-25 py-30">
      <Button @click="onSubmit" size="lg">{{ addSubPlan ? $t('label.submit') : $t('common.save') }}</Button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request'
import { SUB_PLAN_STATUS } from '@const'
import { IMAGE_LIMIT_COUNT } from '@const/publish'
import uploadImage from '@/http/upload/uploadImage'

const subPlanStore = useSubPlanStore()
const { alert } = useModalStore()
const { back, close } = subPlanStore
const {
  history,
  data,
  index,
  status,
  addSubPlan,
  subPlanName,
  subPlanContent,
  subPlanPrice,
  subUnlockDayAfter,
  subId,
  subPicture,
  uploadFiles,
  selDefaultItem,
  selUploadItem,
} = storeToRefs(subPlanStore)
const showBack = computed(() => history.value.length > 0)

// const selectedValue = ref(0)
// const wrapValue = ref(0)
// const handleUpdate = (value) => {
//   if (value === 'custom' && wrapValue.value !== '') {
//     console.log(selectedValue.value, wrapValue.value)
//   }
// }
// watch(wrapValue, (newValue) => {
//   if (newValue) {
//     wrapValue.value = newValue
//   }
// })

onMounted(async () => {
  subPlanName.value = data.value[index.value]?.name
  subPlanContent.value = data.value[index.value]?.content
  subPlanPrice.value = data.value[index.value]?.price
  subUnlockDayAfter.value = data.value[index.value]?.unlock_day_after_subscribe
  subId.value = data.value[index.value]?.id
  subPicture.value = data.value[index.value]?.picture
  status.value = data.value[index.value]?.status
  if (addSubPlan.value && subPicture.value === undefined) {
    uploadFiles.value = []
    selUploadItem.value = null
    selDefaultItem.value = appConfig.subscription_images[0]
  }
  if (!addSubPlan.value && subPicture.value) {
    selDefaultItem.value = null
    uploadFiles.value = []
    uploadFiles.value.push({ result: subPicture.value, progress: 1 })
    selUploadItem.value = subPicture.value
  }
  if (addSubPlan.value) {
    subPlanName.value = ''
    subPlanContent.value = ''
    subPlanPrice.value = ''
    subUnlockDayAfter.value = ''
  }
})

// 重新進入任一設定頁，會監聽數據是否改變了
watch(index, (newIndex) => {
  if (newIndex !== null && data.value[newIndex]) {
    subPlanName.value = data.value[newIndex].name
    subPlanContent.value = data.value[newIndex].content
    subPlanPrice.value = data.value[newIndex].price
    subUnlockDayAfter.value = data.value[index.value].unlock_day_after_subscribe
    subId.value = data.value[index.value].id
    subPicture.value = data.value[index.value]?.picture
    selUploadItem.value = data.value[index.value]?.picture
  }
})

watch(addSubPlan, (newAddSubPlan) => {
  if (newAddSubPlan) {
    uploadFiles.value = []
    selUploadItem.value = null
    selDefaultItem.value = appConfig.subscription_images[0]
    subPlanName.value = ''
    subPlanContent.value = ''
    subPlanPrice.value = ''
    subUnlockDayAfter.value = ''
    subPicture.value = ''
  } else {
    if (subPicture.value) {
      selDefaultItem.value = null
      uploadFiles.value = []
      uploadFiles.value.push({ result: subPicture.value, progress: 1 })
    }
    selDefaultItem.value = null
    selUploadItem.value = data.value[index.value].picture
  }
})

watch(subPicture, (newSubPicture) => {
  if (!addSubPlan.value && newSubPicture) {
    selDefaultItem.value = null
    selUploadItem.value = newSubPicture
    uploadFiles.value = []
    uploadFiles.value.push({ result: newSubPicture, progress: 1 })
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
      title: '最多上傳10張圖',
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
      console.error('上傳錯誤', error)
    }
  }
}
const removeUploadFile = (index) => {
  uploadFiles.value.splice(index, 1)
}

const delSubPlan = async () => {
  const { execute: subPlanDel } = useRequest('Subscription.bulkDel')
  const payload = {
    ids: subId.value,
  }
  try {
    await subPlanDel(payload)
    alert({
      title: '刪除成功',
    })
    close()
  } catch (e) {
    console.error(e)
  }
}

const onSubmit = async () => {
  const data = makeReqData()
  const { execute: subPlanUpdate } = useRequest('Subscription.update')
  const { execute: subPlanCreate } = useRequest('Subscription.create')
  if (addSubPlan.value) {
    try {
      await subPlanCreate(data)
      alert({
        title: '發布成功',
      })
      uploadFiles.value = []
      subPlanName.value = ''
      subPlanContent.value = ''
      subPlanPrice.value = ''
      subUnlockDayAfter.value = ''
      close()
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await subPlanUpdate(data)
      alert({
        title: '更新成功',
      })
      close()
    } catch (e) {
      console.error(e)
      back()
    }
  }
}

function makeReqData() {
  const data = {
    name: subPlanName.value,
    content: subPlanContent.value,
    price: subPlanPrice.value,
    unlock_day_after_subscribe: subUnlockDayAfter.value,
  }
  if (subId.value) {
    data.id = subId.value
  }
  if (subPlanContent.value) {
    data.content = subPlanContent.value
  }
  if (selDefaultItem.value || selUploadItem.value) {
    data.picture = selDefaultItem.value || selUploadItem.value
  }
  if (status.value === SUB_PLAN_STATUS.DISABLE) {
    data.status = status.value = SUB_PLAN_STATUS.DISABLE
  } else if (status.value === SUB_PLAN_STATUS.ENABLE) {
    data.status = status.value = SUB_PLAN_STATUS.ENABLE
  }

  return data
}
</script>
