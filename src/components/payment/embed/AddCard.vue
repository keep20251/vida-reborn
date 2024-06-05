<template>
  <div class="flex flex-col space-y-10">
    <div v-show="isReady" class="text-sm font-normal leading-3 text-gray-57">{{ $t('payment.addCard.security') }}</div>
    <form id="payment-form" @submit.prevent="onSubmit">
      <div class="flex flex-col space-y-10">
        <div id="stripe-element"></div>
        <Checkbox
          v-show="isReady"
          v-model="checkbox.value"
          :info="$t('payment.addCard.check')"
          :error="checkbox.error"
          mark-color="gray"
          size="sm"
          @update:modelValue="checkbox.error = ''"
        ></Checkbox>
        <div v-if="stripeError" class="text-sm text-red-500">{{ stripeError }}</div>
      </div>
      <button id="payment-submit-btn" class="hidden rounded-sm bg-primary px-4 py-2 text-white" type="submit"></button>
    </form>
    <div v-show="isReady" class="flex flex-row space-x-10">
      <div v-for="image in images" :key="`credit-card-${image.alt}`">
        <img :src="image.src" :alt="image.src" />
      </div>
    </div>
    <div v-show="isReady" class="text-xs font-medium leading-3 text-gray-57">
      {{ $t('payment.addCard.address') }}
    </div>
    <div v-show="!isReady" class="flex animate-pulse flex-col space-y-10">
      <div class="h-12 w-full rounded-sm bg-gray-cc"></div>
      <div class="h-12 w-full rounded-sm bg-gray-cc"></div>
      <div class="h-24 w-full rounded-sm bg-gray-cc"></div>
      <div class="h-24 w-full rounded-sm bg-gray-cc"></div>
    </div>
  </div>
</template>
<script setup>
import { loadStripe } from '@stripe/stripe-js'
import { onActivated, onDeactivated, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStripeAppearance } from '@use/payment/stripe-appearance'
import DinersClub from '@/assets/images/payment/credit-card/diners-club.png'
import Discover from '@/assets/images/payment/credit-card/discover.png'
import JCB from '@/assets/images/payment/credit-card/jcb.png'
import Maestro from '@/assets/images/payment/credit-card/maestro.png'
import MasterCard from '@/assets/images/payment/credit-card/master-card.png'
import Visa from '@/assets/images/payment/credit-card/visa.png'
import Checkbox from '@/components/form/Checkbox.vue'
import useRequest from '@/compositions/request'
import { useYup } from '@/compositions/validator/yup'

const emits = defineEmits(['complete'])
const { t: $t } = useI18n()

const checkbox = reactive({
  value: false,
  error: '',
  check: false,
})

const { Yup, validate } = useYup()
const schema = Yup.boolean().required().oneOf([true], { key: 'yup.boolean.oneOf' })

const images = [
  { src: Visa, alt: 'Visa' },
  { src: MasterCard, alt: 'MasterCard' },
  { src: Maestro, alt: 'Maestro' },
  { src: DinersClub, alt: 'DinersClub' },
  { src: Discover, alt: 'Discover' },
  { src: JCB, alt: 'JCB' },
]

const stripeError = ref('')

let stripe
let elements
let clientSecret

const isReady = ref(false)

async function createStripePayment() {
  const { client_secret, publishable_key } = await useRequest('Payment.getStripeKey', { immediate: true })
  stripe = await loadStripe(publishable_key)

  const { themeDefault } = useStripeAppearance()
  elements = stripe.elements({
    clientSecret: client_secret,
    appearance: themeDefault,
  })

  const paymentElement = elements.create('payment')
  paymentElement.mount('#stripe-element')
  paymentElement.on('ready', () => {
    console.log('Stripe Payment Element is ready')
    isReady.value = true
  })
}

async function onSubmit(e) {
  e.preventDefault()
  try {
    await validate(schema, checkbox)

    const setupResponse = await stripe.confirmSetup({
      elements,
      clientSecret,
      redirect: 'if_required',
      confirmParams: {
        return_url: import.meta.env.VITE_APP_URL,
      },
    })

    if (setupResponse.error) {
      stripeError.value = setupResponse.error.message
      emits('complete', { status: false, intent: null, error: setupResponse.error })
    }

    if (setupResponse.setupIntent.status === 'succeeded') {
      emits('complete', { status: true, intent: setupResponse.setupIntent, error: null })
    } else {
      new Promise((resolve, reject) => {
        const retry = 10
        let count = 0

        const interval = setInterval(async () => {
          const { setupIntent } = await stripe.retrieveSetupIntent(setupResponse.setupIntent.client_secret)
          if (setupIntent.status === 'succeeded') {
            clearInterval(interval)
            resolve(setupIntent)
          } else {
            if (count > retry) {
              clearInterval(interval)
              reject(new Error(`setupIntent not succeeded after ${retry} retries`))
            }
            count++
          }
        }, 500)
      })
        .then((setupIntent) => emits('complete', { status: true, intent: setupIntent, error: null }))
        .catch((e) => emits('complete', { status: false, intent: null, error: { message: e } }))
    }
  } catch (e) {
    console.error('AddCard.onSubmit Error', e)
    emits('complete', { status: false, intent: null, error: { message: e.message } })
  }
}

onActivated(async () => {
  await createStripePayment()
})
onDeactivated(() => {
  stripeError.value = ''
  checkbox.value = false
  checkbox.error = ''
})
</script>
