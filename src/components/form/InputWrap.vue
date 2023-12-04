<template>
  <div class="input-wrap">
    <label v-if="label">{{ label }}</label>
    <div class="input-row">
      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="value"
        :class="{
          'append-icon': !!appendIcon,
        }"
      />
      <div class="px-5"></div>
      <Icon v-if="!!appendIcon" :size="20" :name="appendIcon" class="append" @click="emits('click:append-icon')"></Icon>
    </div>
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
    display: flex;
    flex-direction: column;
    .input-row {
      display: flex;
      position: relative;
      align-items: center;
    }
    .append {
      position: absolute;
      right: 0.625rem;
      cursor: pointer;
    }
    .append-icon {
      padding-right: 1.875rem;
    }
    & input {
      border-radius: 1.125rem;
      border: 0.00625rem solid rgba(0, 0, 0, 0.2);
      background: #fff;
      box-shadow: 0 -0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.1) inset;
      width: 100%;
      height: 2.1875rem;
      flex-shrink: 0;
      outline: none;
      padding: 0.75rem 0.625rem 0.6875rem 0.625rem;
      color: rgba(0, 0, 0, 0.66);
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.75rem;
      &::placeholder {
        color: rgba(0, 0, 0, 0.36);
      }
    }
    & label {
      margin-bottom: 0.625rem;
      color: #000;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.875rem;
    }
  }
}
</style>
