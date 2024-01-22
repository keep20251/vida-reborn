<template>
  <InputWrap
    v-model="modelValue"
    :label="$t(props.label)"
    :placeholder="$t(props.placeholder)"
    :append-text-btn="appendTextBtn"
    :append-text="appendText"
    :err-msg="props.errMsg"
    :label-center="props.labelCenter"
    @click:append="onResendClick"
  ></InputWrap>
</template>
<script setup>
import InputWrap from '@/components/form/InputWrap.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  onResend: {
    type: Function,
    required: true,
  },
  label: {
    type: String,
    default: 'label.mailCode',
  },
  labelCenter: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'placeholder.mailCode',
  },
  appendTextBtn: {
    type: String,
    default: 'label.resend',
  },
  errMsg: {
    type: String,
    default: '',
  },
  waitTime: {
    type: Number,
    default: 60,
  },
  firstTime: {
    type: Boolean,
    default: true,
  },
  firstTimeText: {
    type: String,
    default: 'label.sendMailCode',
  },
})

const emits = defineEmits(['update:modelValue', 'error'])

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  },
})

const sent = ref(false)
const tick = ref(props.waitTime)

async function onResendClick() {
  sent.value = true
  const countdown = setInterval(() => {
    if (tick.value === 0) {
      finished()
    } else {
      tick.value--
    }
  }, 1000)

  try {
    await props.onResend(modelValue.value)
  } catch (e) {
    console.error(e)
    emits('error', e.message)
    finished()
  }

  function finished() {
    clearInterval(countdown)
    sent.value = false
    tick.value = props.waitTime
  }
}

const { t: $t } = useI18n()
const appendTextBtn = computed(() => {
  if (sent.value) return ''
  else if (props.firstTime) return $t(props.firstTimeText)
  else return $t(props.appendTextBtn)
})
const appendText = computed(() => (sent.value ? `${tick.value}s` : ''))
</script>
