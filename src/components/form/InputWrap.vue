<template>
  <div class="flex flex-col space-y-10">
    <label v-if="label" class="flex text-base font-normal not-italic leading-md" :class="[labelCenter]"
      >{{ label }}
      <span v-if="sublabel" class="translate-y-2 pl-5 text-sm font-normal not-italic leading-3 text-gray-57">{{
        sublabel
      }}</span>
      <div v-if="labelIcon" class="flex cursor-pointer items-center pl-4">
        <Icon :name="labelIcon" size="8" @click="emits('click:labelIcon')"></Icon>
      </div>
      <transition
        enter-active-class="transition duration-500 ease-in"
        leave-active-class="transition duration-500 ease-out"
        enter-from-class="transform -translate-x-5 opacity-0"
        leave-to-class="transform -translate-x-5 opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-from-class="transform translate-x-0 opacity-100"
      >
        <div v-if="tip" class="relative flex flex-1">
          <div
            class="absolute -top-[75%] ml-4 flex -translate-y-1/2 rounded-bl-[0.15rem] rounded-br-2xl rounded-tl-3xl rounded-tr-2xl bg-gray-500 bg-opacity-50 py-4 pl-12 pr-8 text-xs text-white sm:-top-[25%]"
          >
            {{ tip }}
          </div>
        </div>
      </transition>
    </label>
    <div class="flex flex-col space-y-2">
      <div class="relative flex items-center">
        <input
          v-model="value"
          ref="input"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :maxlength="maxLength"
          :class="{
            'pl-50 ': !!prependIcon,
            'pr-50': !!appendIcon,
            'pr-[7.25rem]': !!appendText,
            'pr-60': !!appendTextBtn,
            'pr-52': !!appendIconBtn,
            'pr-48': !!password,
          }"
          :step="step"
          class="h-35 w-full shrink-0 appearance-none divide-solid rounded-2xl border-gray-cc bg-white px-20 py-12 text-sm font-normal not-italic leading-3 text-gray-57 shadow-input outline-none placeholder:text-sm placeholder:text-gray-a3"
          @keypress.enter="emits('keypress:enter')"
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
          class="absolute right-20 flex items-center justify-center rounded-xl text-center text-sm font-normal leading-3 text-gray-a3"
          @click="emits('click:append')"
        >
          {{ appendText }}
        </div>
        <div
          v-if="!!appendTextBtn"
          class="min-w-47 absolute right-0 flex h-26 cursor-pointer items-center justify-center px-20 py-10 text-center text-sm font-normal leading-3 text-black"
          @click="emits('click:append')"
        >
          {{ appendTextBtn }}
        </div>
        <div
          v-if="!!appendLabelBtn"
          class="absolute right-5 flex h-26 w-40 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-10 text-center text-sm font-bold leading-md text-white shadow-md"
          @click="emits('click:append')"
        >
          {{ appendLabelBtn }}
        </div>
        <div
          v-if="!!appendIconBtn"
          class="absolute right-5 flex h-30 w-40 cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-10 text-center text-base font-bold leading-md text-white shadow-md"
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
import { computed, onActivated, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'

const props = defineProps({
  label: { type: String },
  labelCenter: { type: Boolean, default: false },
  sublabel: { type: String },
  labelIcon: { type: String },
  tip: { type: String },
  modelValue: { type: [String, Number], required: true },
  placeholder: { type: String, default: '输入文字...' },
  password: { type: Boolean, default: false },
  number: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  appendText: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  appendTextBtn: { type: String, default: '' },
  appendLabelBtn: { type: String, default: '' },
  appendIconBtn: { type: String, default: '' },
  prependIcon: { type: String, default: '' },
  maxLength: { type: Number },
  errMsg: { type: String, default: '' },
  typingAppend: { type: Boolean, default: false },
  focus: { type: Boolean, default: false },
  step: { type: String, default: '0.01' },
})

const emits = defineEmits(['update:modelValue', 'click:prepend', 'click:append', 'keypress:enter', 'click:labelIcon'])

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

const { isDesktop } = storeToRefs(useAppStore())
const input = ref(null)
whenever(
  () => props.focus,
  () => isDesktop.value && input.value.focus(),
)
onActivated(() => props.focus && isDesktop.value && input.value.focus())
</script>
