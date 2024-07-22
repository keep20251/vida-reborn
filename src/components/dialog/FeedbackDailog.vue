<template>
  <BaseDialog v-if="isOpen" size="lg" no-padding @click:around="closeFeedback">
    <template #default>
      <div class="h-full w-full rounded-xl">
        <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
          <div class="flex flex-col items-center space-y-10">
            <div class="text-lg font-bold leading-lg text-white">
              {{ $t('dialog.feedback.title') }}
            </div>
            <div class="text-sm font-normal leading-3 text-white">
              {{ $t('dialog.feedback.subtitle') }}
            </div>
          </div>
          <div class="absolute right-0 top-0 cursor-pointer px-15 pb-10 pt-15" @click="closeFeedback">
            <Icon name="closeWhite" size="20"></Icon>
          </div>
        </div>
        <div class="flex max-h-[75vh] flex-col space-y-20 overflow-auto px-26 py-30 md:lg:xl:px-50 md:lg:xl:max-h-none">
          <label class="flex flex-col space-y-10">
            <span class="select-none text-base font-normal leading-md">{{ $t('dialog.feedback.type') }}</span>
            <Dropdown
              v-model="reason"
              :options="reasonOptions"
              option-label="label"
              option-value="value"
              inset
            ></Dropdown>
          </label>
          <TextareaWrap
            v-model="description.value"
            :label="$t('dialog.feedback.textarea.label')"
            :placeholder="$t('dialog.feedback.textarea.placeholder')"
            :line="16"
            :err-msg="description.error"
          ></TextareaWrap>
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/gif"
            hidden
            ref="inputRef"
            multiple
            @change="onInputFileChange"
          />
          <div class="flex flex-col space-y-5 px-20">
            <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between">
              <div class="flex flex-row items-center">
                <p
                  class="max-w-[20rem] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-lg text-gray-a3"
                >
                  {{ decorateFilename(file.name) }}
                </p>
                <span class="text-sm font-medium leading-lg text-gray-a3">({{ toKMBTString(file.size) }})</span>
              </div>
              <Icon size="14" name="close" class="cursor-pointer align-middle" @click="removeFile(index)"></Icon>
            </div>
          </div>
          <div class="flex flex-col space-y-10">
            <button class="rounded-full border border-gray-57 py-10 text-center" @click="onAddClicked">
              <Icon class="mr-5 align-middle" size="10" name="publish"></Icon>
              <span class="text-base font-normal leading-lg">
                {{ $t('dialog.feedback.addImage') }}
              </span>
            </button>
            <p v-if="uploadError" class="text-left text-sm font-normal not-italic leading-md text-warning">
              {{ uploadError }}
            </p>
          </div>
          <div class="flex flex-col space-y-10">
            <InputWrap
              v-model="email.value"
              :label="$t('dialog.feedback.input.label')"
              :placeholder="$t('dialog.feedback.input.placeholder')"
              :err-msg="email.error"
            ></InputWrap>
            <p v-if="serverError" class="text-left text-sm font-normal not-italic leading-md text-warning">
              {{ serverError }}
            </p>
          </div>

          <div class="flex w-full space-x-8">
            <Button cancel @click="closeFeedback" :disabled="isLoading">
              {{ $t('common.cancel') }}
            </Button>
            <Button @click="onExecute(onConfirm)" :loading="isLoading">
              {{ $t('common.confirm') }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import { useModalStore } from '@/store/modal'
import { splitFilename, toKMBTString } from '@/utils/string-helper'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import useRequest from '@/compositions/request'
import { useExecutionLock } from '@/compositions/utils/execution-lock'
import { useYup } from '@/compositions/validator/yup'
import uploadImage from '@/http/upload/uploadImage'
import Button from '../common/Button.vue'
import Dropdown from '../form/Dropdown.vue'
import InputWrap from '../form/InputWrap.vue'
import TextareaWrap from '../form/TextareaWrap.vue'

const { t: $t } = useI18n()

const reasonOptions = [
  { value: 1, label: 'dialog.feedback.options.1' },
  { value: 2, label: 'dialog.feedback.options.2' },
  { value: 3, label: 'dialog.feedback.options.3' },
  { value: 4, label: 'dialog.feedback.options.4' },
  { value: 5, label: 'dialog.feedback.options.5' },
  { value: 6, label: 'dialog.feedback.options.6' },
  { value: 7, label: 'dialog.feedback.options.7' },
  { value: 8, label: 'dialog.feedback.options.8' },
  { value: 9, label: 'dialog.feedback.options.9' },
  { value: 10, label: 'dialog.feedback.options.10' },
]

const dialogStore = useDialogStore()
const { closeFeedback } = dialogStore
const { feedbackDialog: isOpen } = storeToRefs(useDialogStore())

const reason = ref(1)

const description = reactive({
  value: '',
  error: '',
  check: false,
})

const email = reactive({
  value: '',
  error: '',
  check: false,
})

function reset() {
  reason.value = 1
  description.value = ''
  email.value = ''
  description.error = ''
  email.error = ''
  serverError.value = ''
  uploadError.value = ''
  files.value = []
}

const { Yup, validate } = useYup()
const { string } = Yup
const schema = {
  email: string().email().required(),
  description: string().required().max(300),
}

const { disabled: isLoading, onExecute } = useExecutionLock()
const serverError = ref('')
const { alert } = useModalStore()
const onConfirm = async () => {
  try {
    await Promise.all([validate(schema.description, description), validate(schema.email, email)])
    if (email.errMsg || description.errMsg) return

    const attachment = await Promise.all(files.value.map((file) => uploadImage(file, () => {})))
    const params = {
      type: reason.value,
      content: description.value,
      email: email.value,
      attachment,
    }
    const result = await useRequest('App.feedback', { params, immediate: true })
    if (result) {
      alert({
        size: 'sm',
        title: $t('dialog.feedback.modal.title'),
        titleClass: '!text-lg !font-bold !leading-lg',
        content: $t('dialog.feedback.modal.content'),
        confirmText: $t('common.confirm'),
        contentClass: '!text-base !font-normal !leading-lg',
      })
      closeFeedback()
      reset()
    }
  } catch (e) {
    console.error(e)
    serverError.value = e?.message || e
  }
}

const onAddClicked = () => inputRef.value.click()
const uploadError = ref('')

const inputRef = ref(null)
const files = ref([])
function onInputFileChange(e) {
  if (e.target.files > 3 || files.value.length + e.target.files.length > 3) {
    uploadError.value = $t('dialog.feedback.uploadLimit')
    return
  }
  uploadError.value = ''
  files.value = files.value.concat(Array.from(e.target.files))
}

const removeFile = (index) => files.value.splice(index, 1)

const decorateFilename = (filename) => {
  const { name, ext } = splitFilename(filename)
  return `${name.slice(0, 40)}...${ext}`
}
</script>
