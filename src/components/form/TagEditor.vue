<template>
  <div class="flex flex-col space-y-10">
    <label class="text-left text-base leading-md">Tag</label>
    <OptionsPicker v-model="tags" :options="tagOptions"></OptionsPicker>
    <InputWrap
      v-model="tagInput"
      :placeholder="'Add new tag...'"
      :append-text-btn="'Add'"
      @click:append="addTag"
    ></InputWrap>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
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

function addTag() {
  if (!tagInput.value) {
    return
  }

  const tag = tagInput.value

  // 緩存中已存在
  if (tagOptions.value.some((t) => t.value === tag)) {
    tags.value.push(tag)
    tagInput.value = ''
    return
  }

  // 緩存中已滿 10 個
  if (tagOptions.value.length === 10) {
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
