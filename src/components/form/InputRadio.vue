<template>
  <div class="input-wrap">
    <input
      type="radio"
      :id="id"
      :value="value"
      :name="name"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
    />
    <label :for="id" v-if="label">{{ label }}</label>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: [String, Number, Boolean], required: true },
  name: { type: String, required: true },
  modelValue: { type: [String, Number, Boolean], required: true },
  disabled: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

const isChecked = ref(props.modelValue === props.value)

const handleChange = () => {
  emits('update:modelValue', props.value)
}
</script>
<style lang="scss" scoped>
.input {
  &-wrap {
    display: flex;
    flex-direction: row;
    & label {
      margin-left: 10px;
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
    & input {
      &[type='radio'] {
        position: absolute;
        opacity: 0;
        & + label:before {
          content: '';
          background: #d9d9d9;
          border-radius: 4px;
          display: inline-block;
          width: 15px;
          height: 15px;
          position: relative;
          margin-right: 10px;
          vertical-align: top;
          cursor: pointer;
          text-align: center;
          -webkit-transition: all 250ms ease;
          transition: all 250ms ease;
        }
        &:checked + label:before {
          background-color: #6567e8;
          content: url('@/assets/icons/fantasi/common/radio-check.svg');
        }
        &:focus + label:before {
          outline: none;
        }
        &:disabled + label:before {
          background: #b4b4b4;
        }
      }
    }
  }
}
</style>
