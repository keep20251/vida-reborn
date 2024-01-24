<template>
  <div class="flex flex-col space-y-10">
    <label v-if="label" class="text-base font-normal not-italic leading-md" :class="[labelCenter]"
      >{{ label }}
      <span v-if="sublabel" class="text-sm font-normal not-italic leading-3 text-gray66">{{ sublabel }}</span>
    </label>
    <div class="flex flex-col space-y-2">
      <div class="relative flex items-center">
        <input
          v-model="value"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :value="value"
          :maxlength="maxLength"
          :class="{
            'pl-50 ': !!prependIcon,
            'pr-50': !!appendIcon,
            'pr-[7.25rem]': !!appendText,
            'pr-60': !!appendTextBtn,
            'pr-52': !!appendIconBtn,
            'pr-48': !!password,
          }"
          class="h-35 w-full shrink-0 divide-solid rounded-2xl border-gray20 bg-white px-20 py-12 text-sm font-normal not-italic leading-3 text-gray66 shadow-[inset_0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)] outline-none placeholder:text-sm placeholder:text-gray36"
        />
        <Icon
          v-if="!!prependIcon"
          size="15"
          :name="prependIcon"
          class="absolute left-20"
          @click="emits('click:prepend')"
        ></Icon>
        <Icon
          v-if="!!appendIcon"
          size="15"
          :name="appendIcon"
          class="absolute right-20 cursor-pointer"
          @click="emits('click:append')"
        ></Icon>
        <div
          v-if="!!appendText"
          class="absolute right-20 flex items-center justify-center rounded-xl text-center text-sm font-normal leading-3 text-gray36"
          @click="emits('click:append')"
        >
          {{ appendText }}
        </div>
        <div
          v-if="!!appendTextBtn"
          class="min-w-47 absolute right-5 flex h-26 cursor-pointer items-center justify-center px-6 py-10 text-center text-sm font-normal leading-3 text-black"
          @click="emits('click:append')"
        >
          {{ appendTextBtn }}
        </div>
        <div
          v-if="!!appendIconBtn"
          class="absolute right-5 flex h-30 w-40 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-10 text-center text-base font-bold leading-md text-white shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.25)]"
          @click="emits('click:append')"
        >
          <Icon size="20" :name="appendIconBtn" class="text-white"></Icon>
        </div>
        <Icon
          v-if="!!password"
          size="20"
          :name="pwdHide ? 'pwdClose' : 'pwdOpen'"
          class="absolute right-20 cursor-pointer select-none"
          @click="pwdHide = !pwdHide"
        ></Icon>
      </div>
      <div v-if="errMsg" class="text-left text-sm font-normal not-italic leading-md text-warning">
        {{ errMsg }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: { type: String },
  labelCenter: { type: Boolean, default: false },
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
const labelCenter = computed(() => (props.labelCenter ? 'text-center' : 'text-left'))
</script>
