<template>
  <div class="mb-16 flex flex-col space-y-8">
    <div class="text-base font-normal">
      {{ $t('info.passwordValidate.title') }}
    </div>
    <div class="flex space-x-6 align-middle text-base font-medium">
      <Icon :name="firstSchema ? 'checkActive' : 'check'"></Icon>
      <span class="text-gray-57">{{ $t('info.passwordValidate.min') }}</span>
    </div>
    <div class="flex space-x-6 align-middle text-base font-medium">
      <Icon :name="secondSchema ? 'checkActive' : 'check'"></Icon>
      <span class="text-gray-57">{{ $t('info.passwordValidate.schema') }}</span>
    </div>
  </div>
</template>
<script setup>
import { computed, watch } from 'vue'
import { useYup } from '@use/validator/yup'

const { Yup } = useYup()
const { string } = Yup

const props = defineProps({
  password: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:validate'])

const firstSchema = computed(() => string().required().min(8).isValidSync(props.password))
const secondSchema = computed(() => string().required().complexPassword().isValidSync(props.password))

watch(
  () => props.password,
  () => {
    emit('update:validate', firstSchema.value && secondSchema.value)
  },
  { immediate: true },
)
</script>
