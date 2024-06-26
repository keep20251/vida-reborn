<template>
  <div class="flex flex-col space-y-10">
    <label class="text-left text-base leading-md">Tag</label>
    <OptionsPicker v-model="tags" :options="tagOptions" can-pick-none can-delete @delete="deleteTag"></OptionsPicker>
    <InputWrap v-model="tagInput" :append-label-btn="$t('label.add')" @click:append="addTag"></InputWrap>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { useModalStore } from '@/store/modal'
import InputWrap from '@comp/form/InputWrap.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import { LOCAL_STORAGE_KEYS } from '@const'

const props = defineProps({
  modelValue: { type: Array, required: true },
  errMsg: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue'])

const tagInput = ref('')
const tags = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emits('update:modelValue', v)
  },
})
const tagOptions = useLocalStorage(LOCAL_STORAGE_KEYS.FEED_TAGS, [])

const { t: $t } = useI18n()
const { alert } = useModalStore()
const TAG_COUNT_LIMIT = 10
const TAG_NAME_LESS = 2
const TAG_NAME_MORE = 20
function addTag() {
  if (!tagInput.value) {
    return
  }

  const tag = tagInput.value

  // 長度不符合
  if (stringWidth(tag) < TAG_NAME_LESS) {
    alert({ title: 'info.publishTagNameLess' })
    return
  }
  if (stringWidth(tag) > TAG_NAME_MORE) {
    alert({ title: 'info.publishTagNameMore' })
    return
  }

  // 緩存中已存在
  if (tagOptions.value.some((t) => t.value === tag)) {
    tags.value.push(tag)
    tagInput.value = ''
    return
  }

  // 緩存中已滿 10 個
  if (tagOptions.value.length === TAG_COUNT_LIMIT) {
    const removedTag = tagOptions.value.pop()
    const tagIndex = tags.value.indexOf(removedTag.value)
    if (tagIndex >= 0) {
      tags.value.splice(tagIndex, 1)
    }
  }

  tagOptions.value.unshift({ label: tag, value: tag })
  tags.value.push(tag)
  tagInput.value = ''
}
function deleteTag(value) {
  const tagOptionIndex = tagOptions.value.findIndex((e) => e.value === value)
  if (tagOptionIndex >= 0) {
    tagOptions.value.splice(tagOptionIndex, 1)
  }
  const tagIndex = tags.value.indexOf(value)
  if (tagIndex >= 0) {
    tags.value.splice(tagIndex, 1)
  }
}

function stringWidth(str) {
  let width = 0
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-control-regex
    width += /[^\x00-\x7F]/.test(str.charAt(i)) ? 2 : 1
  }
  return width
}

watch(
  () => props.modelValue,
  (v) => {
    v.forEach((tag) => {
      if (!tagOptions.value.some((t) => t.value === tag)) {
        if (tagOptions.value.length === 10) {
          tagOptions.value.pop()
        }
        tagOptions.value.unshift({ label: tag, value: tag })
      }
    })
  },
  { immediate: true },
)
</script>
