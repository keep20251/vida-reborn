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
            v-for="(item, index) in defaultImg"
            :key="index"
            :class="[
              { ' border-primary shadow-xl': selDefaultItem === item, 'border-transparent': selDefaultItem !== item },
            ]"
            class="relative overflow-hidden rounded-sm border-2 pb-[64%]"
          >
            <div @click="selDefaultImg(item)" class="absolute top-0 h-full w-full cursor-pointer">
              <img :src="item" class="h-full w-full object-cover" />
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
import { useSubPlanStore } from '@/store/sub-plan'
import Button from '@comp/common/Button.vue'
import InputWrap from '@comp/form/InputWrap.vue'
import useRequest from '@use/request'
import { IMAGE_LIMIT_COUNT } from '@const/publish'
import uploadImage from '@/http/upload/uploadImage'

const subPlanStore = useSubPlanStore()
const { back, close } = subPlanStore
const { history, data, index, addSubPlan, subPlanName, subPlanContent, subPlanPrice, subUnlockDayAfter, subId } =
  storeToRefs(subPlanStore)
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

onMounted(() => {
  subPlanName.value = data.value[index.value]?.name
  subPlanContent.value = data.value[index.value]?.content
  subPlanPrice.value = data.value[index.value]?.price
  subUnlockDayAfter.value = data.value[index.value]?.unlock_day_after_subscribe
  subId.value = data.value[index.value]?.id
})

watch(index, (newIndex) => {
  if (newIndex !== null && data.value[newIndex]) {
    subPlanName.value = data.value[newIndex].name
    subPlanContent.value = data.value[newIndex].content
    subPlanPrice.value = data.value[newIndex].price
    subUnlockDayAfter.value = data.value[index.value].unlock_day_after_subscribe
    subId.value = data.value[index.value].id
  }
})

// 等待 UI 圖片整理完成
const defaultImg = ref([
  'https://images.pexels.com/photos/764368/pexels-photo-764368.jpeg',
  'https://images.pexels.com/photos/3782766/pexels-photo-3782766.jpeg',
  'https://images.pexels.com/photos/3226837/pexels-photo-3226837.jpeg',
])
const inputImage = ref(null)
const { appConfig } = useAppStore()
const uploadFiles = ref([])
const selDefaultItem = ref(defaultImg.value[0])
const selUploadItem = ref(null)

const selDefaultImg = (item) => {
  selDefaultItem.value = item
  if (selUploadItem.value !== null) {
    selUploadItem.value = null
  }
  console.log('你選了', selDefaultItem.value)
}
const selUploadImg = (item) => {
  selUploadItem.value = item.result
  if (selDefaultItem.value !== null) {
    selDefaultItem.value = null
  }
  console.log('你選了', selUploadItem.value)
}

const handleFileUpload = async (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  const totalFiles = uploadFiles.value.length + files.length

  if (totalFiles > 7) {
    alert('最多上傳10張圖')
    return
  }

  for (const file of files) {
    try {
      const progress = ref(0)
      const url = await uploadImage(file, (p) => {
        progress.value = p
      })
      uploadFiles.value.push({ result: appConfig.config.img_url + url, progress })
      console.log(uploadFiles.value, '小次郎')
    } catch (error) {
      console.error('上傳錯誤', error)
    }
  }
}

const removeUploadFile = (index) => {
  uploadFiles.value.splice(index, 1)
}

const delSubPlan = async () => {
  console.log('刪除這篇訂閱方案')
  const { execute: subPlanDel } = useRequest('Subscription.bulkDel')
  const payload = {
    ids: subId.value,
  }
  try {
    await subPlanDel(payload)
    console.log('成功囉！')
    close()
  } catch (e) {
    console.error(e)
  }
}

const onSubmit = async () => {
  if (addSubPlan) {
    const { execute: subPlanUpdate } = useRequest('Subscription.update')
    const payload = {
      id: subId.value,
      name: subPlanName.value,
      content: subPlanContent.value,
      price: subPlanPrice.value,
      unlock_day_after_subscribe: subUnlockDayAfter.value,
    }
    try {
      await subPlanUpdate(payload)
      console.log('成功囉！')
      close()
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log('啊吧')
  }
}
</script>
