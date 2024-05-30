<template>
  <div class="flex flex-col space-y-5">
    <div class="flex flex-row items-center space-x-5">
      <label class="container" :style="{ ...sizeStyle }">
        <input v-model="modelValue" type="checkbox" />
        <span
          class="checkmark"
          :style="{ ...sizeStyle }"
          :class="{
            [markColor]: true,
            [size]: true,
          }"
        ></span>
      </label>
      <div class="pl-4 font-medium text-gray-57" :class="{ [infoSize]: true }">
        {{ info }}
      </div>
    </div>
    <div v-if="error" class="text-xs text-warning">{{ error }}</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false, required: false },
  info: { type: String, required: false, default: '' },
  error: { type: String, required: false, default: '' },
  size: { type: String, default: 'sm' },
  markColor: { type: String, default: 'light' },
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const sizeStyle = computed(() => {
  return {
    lg: { width: '1.5rem', height: '1.5rem' },
    md: { width: '1.25rem', height: '1.25rem' },
    sm: { width: '0.9375rem', height: '0.9375rem' },
  }[props.size]
})

const infoSize = computed(() => {
  return {
    lg: 'text-base leading-4',
    md: 'text-sm leading-4',
    sm: 'text-xs leading-3',
  }[props.size]
})
</script>
<style scoped lang="scss">
.container {
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container input {
  display: none;
}

.checkmark {
  position: absolute;
  display: flex;
  top: 0;
  left: 0;

  border-radius: 0.25rem;
  background-color: #d9d9d9;
}

.container:hover input ~ .checkmark {
  background-color: #d9d9d9;
}

.container input:checked ~ .checkmark {
  background-color: #d9d9d9;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;

  border: solid #ffffff;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container input:checked ~ .checkmark:after {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container .checkmark.sm:after {
  left: 6px;
  top: 2.5px;
  width: 5px;
  height: 10px;
}

.container .checkmark.md:after {
  left: 8px;
  top: 4px;
  width: 7px;
  height: 14px;
}

.container .checkmark.lg:after {
  left: 9px;
  top: 2.5px;
  width: 9px;
  height: 18px;
}

$mark-color: (
  light: #ffffff,
  primary: #6567e8,
  gray: #575757,
  dark: #000000,
);

@each $key, $value in $mark-color {
  .checkmark.#{$key}:after {
    border-color: $value;
  }
}
</style>
