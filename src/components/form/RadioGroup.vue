<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputRadio from '../form/InputRadio.vue'
import InputWrap from '../form/InputWrap.vue'

const { t: $t } = useI18n()

const props = defineProps({
  modelValue: { type: Number, required: true },
  radioKey: { type: String, required: true },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  errMsg: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emits = defineEmits(['update:modelValue'])

const isEnable = computed(() => !props.disabled)

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => isEnable.value && emits('update:modelValue', parseInt(value, 10)),
})

const _options = computed(() => [...props.options, { label: $t('info.customDays'), type: 'custom', value: 0 }])

function initType() {
  const values = props.options.map((option) => option.value)
  return values.includes(modelValue) ? '' : 'custom'
}

const type = ref(initType())
const setType = (v) => (type.value = v)
</script>
<template>
  <div class="grid space-y-10">
    <label class="text-left text-base font-normal not-italic leading-md">{{ label }}</label>
    <div class="flex flex-wrap space-y-5">
      <template v-for="(option, index) in _options" :key="index">
        <InputRadio
          v-if="option.type !== 'custom'"
          v-model="modelValue"
          :id="`${radioKey}-radio-${index}`"
          :label="option.label"
          :value="option.value"
          :name="`${radioKey}-radio`"
          :disabled="disabled"
          class="mr-30"
          @click="() => isEnable && setType(option.type)"
        />
        <div v-else class="flex items-center">
          <InputRadio
            v-model="type"
            :label="$t('info.customDays')"
            :value="option.type"
            :id="`${radioKey}-radio-${index}`"
            :name="`${radioKey}-radio`"
            :disabled="disabled"
          />
          <InputWrap
            v-if="type === option.type"
            v-model="modelValue"
            :placeholder="$t('yup.number.value')"
            :disabled="disabled"
            class="ml-10"
            number
          ></InputWrap>
        </div>
      </template>
    </div>
    <div v-if="errMsg" class="text-left text-sm font-normal not-italic leading-md text-warning">
      {{ errMsg }}
    </div>
  </div>
</template>
