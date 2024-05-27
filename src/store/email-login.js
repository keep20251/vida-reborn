import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useYup } from '@use/validator/yup.js'

export const useEmailLoginStore = defineStore('email-login-store', () => {
  const verifyCode = ref('')
  const password = ref('')
  const checkEmailExist = ref(false)

  const { Yup } = useYup()

  const credential = reactive({
    email: {
      value: '',
      error: '',
      check: false,
      schema: Yup.string().required().email(),
    },
    account: {
      value: '',
      error: '',
      check: false,
      schema: Yup.string().required().account(),
    },
    password: {
      value: '',
      error: '',
      check: false,
      schema: Yup.string().required(),
    },
  })

  return {
    password,
    verifyCode,
    credential,
    checkEmailExist,
  }
})
