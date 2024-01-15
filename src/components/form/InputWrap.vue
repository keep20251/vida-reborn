<template>
  <div class="flex flex-col gap-y-10">
    <label v-if="label" class="text-left text-base font-normal not-italic leading-[0.875rem]"
      >{{ label }}
      <span v-if="sublabel" class="text-sm font-normal not-italic leading-[0.75rem] text-gray66">{{ sublabel }}</span>
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
          'pl-[45px] ': !!prependIcon,
          'pr-45': !!appendIcon,
          'pr-[7.25rem]': !!appendText,
          'pr-[3.75rem]': !!appendTextBtn,
          'pr-[3.25rem]': !!appendIconBtn,
          'pr-48': !!password,
        }"
        class="h-35 w-full shrink-0 divide-solid rounded-[1.125rem] border-gray20 bg-white px-20 pb-[0.6875rem] pt-[0.75rem] text-sm font-normal not-italic leading-[0.75rem] text-gray66 shadow-[0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)inset] outline-none placeholder:text-sm placeholder:text-gray36"
      />
      <Icon
        v-if="!!prependIcon"
        size="20"
        :name="prependIcon"
        class="absolute left-20"
        @click="emits('click:prepend')"
      ></Icon>
      <Icon
        v-if="!!appendIcon"
        size="20"
        :name="appendIcon"
        class="absolute right-20 cursor-pointer"
        @click="emits('click:append')"
      ></Icon>
      <div
        v-if="!!appendText"
        class="absolute right-20 flex items-center justify-center rounded-[0.9375rem] text-center text-sm font-normal leading-[0.75rem] text-gray36"
        @click="emits('click:append')"
      >
        {{ appendText }}
      </div>
      <div
        v-if="!!appendTextBtn"
        class="absolute right-5 flex h-[1.625rem] min-w-[2.9375rem] cursor-pointer items-center justify-center rounded-[0.9375rem] bg-primary px-[0.375rem] py-[0.625rem] text-center text-base font-bold leading-[0.875rem] text-white shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.25)]"
        @click="emits('click:append')"
      >
        {{ appendTextBtn }}
      </div>
      <div
        v-if="!!appendIconBtn"
        class="absolute right-5 flex h-30 w-40 cursor-pointer items-center justify-center rounded-[0.9375rem] bg-primary px-[0.375rem] py-[0.625rem] text-center text-base font-bold leading-[0.875rem] text-white shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.25)]"
        @click="emits('click:append')"
      >
        <Icon size="20" :name="appendIconBtn" class="text-white"></Icon>
      </div>
      <Icon
        v-if="!!password"
        size="20"
        :name="pwdHide ? 'star' : 'starOutline'"
        class="absolute right-20 cursor-pointer select-none"
        @click="pwdHide = !pwdHide"
      ></Icon>
    </div>
    <div v-if="errMsg" class="text-left text-base font-normal not-italic leading-[0.875rem] text-warning">
      {{ errMsg }}
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: { type: String },
  sublabel: { type: String },
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
  prependIcon: { type: String, default: '' },
  maxLength: { type: Number },
  errMsg: { type: String, default: '' },
  typingAppend: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue', 'click:prepend', 'click:append'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  },
})

const pwdHide = ref(true)
const type = computed(() => (props.password && pwdHide.value ? 'password' : props.number ? 'number' : 'text'))
</script>
