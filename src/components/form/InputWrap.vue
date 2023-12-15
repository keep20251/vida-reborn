<template>
  <div class="flex flex-col gap-y-10">
    <label v-if="title" class="text-left text-[0.875rem] font-normal not-italic leading-[0.875rem]"
      >{{ title }}

      <span v-if="subtitle" class="text-[0.75rem] font-normal not-italic leading-[0.75rem] text-gray66">{{
        subtitle
      }}</span>
    </label>

    <div class="relative flex items-center">
      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        :maxlength="maxLength"
        :class="{
          'pr-35': !!appendIcon,
          'pl-10': !!appendIcon,
          'pr-[7.25rem]': !!appendText,
          'pl-[1.25rem]': !!appendText,
          'pr-[3.75rem]': !!appendTextBtn,
          'pl-20': !!appendTextBtn,
          'pr-[3.25rem]': !!appendIconBtn,
          'pl-[0.9175rem]': !!appendIconBtn,
        }"
        class="h-35 w-full shrink-0 divide-solid rounded-[1.125rem] border-gray20 bg-white px-20 pb-[0.6875rem] pt-[0.75rem] text-xs font-normal not-italic leading-[0.75rem] text-gray66 shadow-[0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)inset] outline-none placeholder:text-gray36"
      />
      <Icon
        v-if="!!appendIcon"
        :size="20"
        :name="appendIcon"
        class="absolute right-10 cursor-pointer"
        @click="emits('click:append')"
      ></Icon>
      <div
        v-if="!!appendText"
        class="absolute right-20 flex items-center justify-center rounded-[0.9375rem] text-center text-[0.75rem] font-normal leading-[0.75rem] text-gray36"
        @click="emits('click:append')"
      >
        {{ appendText }}
      </div>
      <div
        v-if="!!appendTextBtn"
        class="absolute right-5 flex h-[1.625rem] min-w-[2.9375rem] cursor-pointer items-center justify-center rounded-[0.9375rem] bg-primary px-[0.375rem] py-[0.625rem] text-center text-[0.875rem] font-bold leading-[0.875rem] text-white shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.25)]"
        @click="emits('click:append')"
      >
        {{ appendTextBtn }}
      </div>
      <div
        v-if="!!appendIconBtn"
        class="absolute right-5 flex h-30 w-40 cursor-pointer items-center justify-center rounded-[0.9375rem] bg-primary px-[0.375rem] py-[0.625rem] text-center text-[0.875rem] font-bold leading-[0.875rem] text-white shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.25)]"
        @click="emits('click:append')"
      >
        <Icon :size="20" :name="appendIconBtn" class="text-white"></Icon>
      </div>
    </div>
    <div v-if="errMsg" class="text-left text-[0.875rem] font-normal not-italic leading-[0.875rem] text-warning">
      {{ errMsg }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String },
  subtitle: { type: String },
  modelValue: { type: [String, Number], required: true },
  placeholder: { type: String, default: '输入文字...' },
  password: { type: Boolean, default: false },
  number: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  value: { type: String },
  appendText: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  appendTextBtn: { type: String, default: '' },
  appendIconBtn: { type: String, default: '' },
  maxLength: { type: Number },
  errMsg: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue', 'click:append'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  },
})

const type = props.password ? 'password' : props.number ? 'number' : 'text'
</script>
