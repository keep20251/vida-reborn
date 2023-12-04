<template>
  <div class="input-wrap">
    <label v-if="label">{{ label }}</label>
    <input v-model="value" :type="type" :placeholder="placeholder" :disabled="disabled" :value="value" />
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String },
  modelValue: { type: [String, Number], required: true },
  placeholder: { type: String, default: '输入文字...' },
  password: { type: Boolean, default: false },
  number: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  value: { type: String },
})

const emits = defineEmits(['update:modelValue'])

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
    display: flex;
    flex-direction: column;
    & input {
      border-radius: 18px;
      border: 0.1px solid rgba(0, 0, 0, 0.2);
      background: #fff;
      box-shadow: 0px -1px 8px 0px rgba(0, 0, 0, 0.1) inset;
      width: 100%;
      height: 35px;
      flex-shrink: 0;
      outline: none;
      padding: 12px 10px 11px 10px;
      color: rgba(0, 0, 0, 0.66);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
      &::placeholder {
        color: rgba(0, 0, 0, 0.36);
      }
    }
    & label {
      margin-bottom: 10px;
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
  }
}
</style>
