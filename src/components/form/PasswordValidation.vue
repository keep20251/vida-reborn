<template>
  <div class="mb-16 flex flex-col gap-y-8">
    <div class="text-base font-normal">
      {{ $t('info.passwordValidate.info') }}
    </div>
    <div class="flex gap-x-6 align-middle text-base font-medium">
      <Icon :name="firstSchema ? 'like' : 'likeOutline'"></Icon>
      <span>{{ $t('info.passwordValidate.min') }}</span>
    </div>
    <div class="flex gap-x-6 align-middle text-base font-medium">
      <Icon :name="secondSchema ? 'like' : 'likeOutline'"></Icon>
      <span>{{ $t('info.passwordValidate.schema') }}</span>
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
