<template>
  <div class="input-wrap flex flex-col">
    <label v-if="title" class="mb-10 text-[0.75rem] font-normal not-italic leading-[0.875rem]"
      >{{ title }}

      <span v-if="subtitle" class="text-gray66 text-[0.75rem] font-normal not-italic leading-[0.75rem]">{{
        subtitle
      }}</span>
    </label>

    <div class="input-row relative flex items-center">
      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        :class="{
          'append-icon': !!appendIcon,
        }"
        class="text-gray66 border-gray20 placeholder:text-gray36 h-35 w-full shrink-0 divide-solid rounded-[1.125rem] bg-white px-[0.625rem] pb-[0.6875rem] pt-[0.75rem] text-xs font-normal not-italic shadow-[0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)inset] outline-none"
      />
      <Icon
        v-if="!!appendIcon"
        :size="20"
        :name="appendIcon"
        class="absolute right-10 cursor-pointer"
        @click="emits('click:append-icon')"
      ></Icon>
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
  appendIcon: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue', 'click:append-icon'])

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
<style lang="scss" scoped>
.input {
  &-wrap {
    .append-icon {
      padding-right: 1.875rem; // 30px
    }
    & input {
      border: 0.00625rem;
    }
  }
}
</style>
