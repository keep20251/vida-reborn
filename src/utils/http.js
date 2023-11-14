import { createFetch } from '@vueuse/core'

export const http = createFetch({
  baseUrl: '',
  combination: 'overwrite',
  options: {
    beforeFetch: ({ options }) => {
      //   options.headers.Authorization
      console.log('options', options)
      return { options }
    },
    afterFetch: (res) => {
      console.log('response', res)
      return res
    },
    onFetchError: (err) => {
      console.error('onError', err)
    },
  },
})
