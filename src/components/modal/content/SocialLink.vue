<template>
  <div class="flex w-full flex-col space-y-20 px-14 py-30">
    <div class="flex flex-col space-y-5">
      <div class="text-base font-normal leading-3">{{ $t('info.socialLink') }}</div>
      <div class="flex flex-col space-y-10">
        <InputWrap
          v-model="socialLinks.instagram.value"
          prepend-icon="socialInstagram"
          :append-icon="socialLinks.instagram.appendIcon"
        ></InputWrap>
        <InputWrap
          v-model="socialLinks.facebook.value"
          prepend-icon="socialFacebook"
          :append-icon="socialLinks.facebook.appendIcon"
        ></InputWrap>
        <InputWrap
          v-model="socialLinks.youtube.value"
          prepend-icon="socialYoutube"
          :append-icon="socialLinks.youtube.appendIcon"
        ></InputWrap>
        <InputWrap
          v-model="socialLinks.twitter.value"
          prepend-icon="socialTwitter"
          :append-icon="socialLinks.twitter.appendIcon"
        ></InputWrap>
        <InputWrap
          v-model="socialLinks.tiktok.value"
          prepend-icon="socialTiktok"
          :append-icon="socialLinks.tiktok.appendIcon"
        ></InputWrap>
      </div>
    </div>
    <div class="flex flex-col space-y-10">
      <div class="text-base font-normal leading-3">{{ $t('info.forExample') }}:https://www.instagram.com/username</div>
      <div class="text-base font-normal leading-3">
        {{ $t('info.accept') }}:Instagram \ Facebook \ Youtube \ Twitter \ Tiktok
      </div>
    </div>
  </div>
</template>
<script setup>
import debounce from 'lodash/debounce'
import { computed, onMounted, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import InputWrap from '@comp/form/InputWrap.vue'
import { useConfirmData } from '@use/modal/confirm-data'
import { useYup } from '@use/validator/yup.js'
import { cleanLink } from '@/utils/string-helper'

const { content } = storeToRefs(useModalStore())
console.log(`content`, content.value)

const hasValue = (obj) => {
  return obj.value.length > 0
}

const { Yup } = useYup()
const socialLinks = reactive({
  instagram: {
    value: '',
    appendIcon: '',
    check: false,
    schema: computed(() => (hasValue(socialLinks.instagram) ? Yup.string().instagram() : Yup.string())),
    parser: (v) => cleanLink(v, /^.*instagram\.com\/([^/]+)/, 'https://www.instagram.com/'),
  },
  twitter: {
    value: '',
    appendIcon: '',
    check: false,
    schema: computed(() => (hasValue(socialLinks.twitter) ? Yup.string().twitter() : Yup.string())),
    parser: (v) => cleanLink(v, /^.*twitter\.com\/(.*)$/, 'https://twitter.com/'),
  },
  tiktok: {
    value: '',
    appendIcon: '',
    check: false,
    schema: computed(() => (hasValue(socialLinks.tiktok) ? Yup.string().tiktok() : Yup.string())),
    parser: (v) => cleanLink(v, /^.*tiktok\.com\/(.*)$/, 'https://www.tiktok.com/'),
  },
  youtube: {
    value: '',
    appendIcon: '',
    check: false,
    schema: computed(() => (hasValue(socialLinks.youtube) ? Yup.string().youtube() : Yup.string())),
    parser: (v) => cleanLink(v, /^.*youtube\.com\/(.*)$/, 'https://www.youtube.com/'),
  },
  facebook: {
    value: '',
    appendIcon: '',
    check: false,
    schema: computed(() => (hasValue(socialLinks.facebook) ? Yup.string().facebook() : Yup.string())),
    parser: (v) => cleanLink(v, /^.*facebook\.com\/(.*)$/, 'https://www.facebook.com'),
  },
})

function setLinksValue(currentContent) {
  socialLinks.instagram.value = currentContent?.instagram?.value ?? ''
  socialLinks.twitter.value = currentContent?.twitter?.value ?? ''
  socialLinks.tiktok.value = currentContent?.tiktok?.value ?? ''
  socialLinks.youtube.value = currentContent?.youtube?.value ?? ''
  socialLinks.facebook.value = currentContent?.facebook?.value ?? ''
}

onMounted(() => setLinksValue(content.value))
watch(content, setLinksValue)

const validate = (obj) => {
  try {
    obj.schema.validateSync(obj.value)
    obj.check = true
    obj.appendIcon = hasValue(obj) ? 'circleSuccess' : ''
  } catch (err) {
    console.log('validate error', err.message)
    obj.appendIcon = 'circleError'
    obj.check = false
  }
}

watch(
  () => socialLinks.instagram.value,
  debounce(() => validate(socialLinks.instagram), 500),
  { immediate: true },
)

watch(
  () => socialLinks.twitter.value,
  debounce(() => validate(socialLinks.twitter), 500),
  { immediate: true },
)

watch(
  () => socialLinks.tiktok.value,
  debounce(() => validate(socialLinks.tiktok), 500),
  { immediate: true },
)

watch(
  () => socialLinks.youtube.value,
  debounce(() => validate(socialLinks.youtube), 500),
  { immediate: true },
)

watch(
  () => socialLinks.facebook.value,
  debounce(() => validate(socialLinks.facebook), 500),
  { immediate: true },
)

useConfirmData(() => {
  Object.values(socialLinks).forEach((link) => validate(link))
  if (Object.values(socialLinks).some((link) => link.check === false)) return false

  const result = {}
  Object.entries(socialLinks).forEach(([key, obj]) => (result[key] = { value: obj.parser(obj.value) }))
  Object.values(socialLinks).forEach((link) => (link.appendIcon = ''))

  return result
})
</script>
