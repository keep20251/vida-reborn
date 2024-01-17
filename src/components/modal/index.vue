<template>
  <div v-show="isOpen" class="fixed top-0 z-50 h-full w-full overflow-hidden bg-black bg-opacity-70">
    <div class="flex h-full items-center justify-center">
      <div class="m-100 mx-20 w-full rounded-xl bg-white px-36 py-30" :class="[modalSize]">
        <div class="mb-20 text-center text-base font-bold leading-[1.125rem]">{{ title }}</div>
        <div class="mb-20">
          <keep-alive :max="5">
            <component :is="component"></component>
          </keep-alive>
        </div>
        <div class="flex space-x-8">
          <Button v-if="cancelAction" @click="cancel" cancel :disabled="confirming">{{
            cancelText || $t('common.cancel')
          }}</Button>
          <Button v-if="confirmAction" @click="checkCustomContentData" :loading="confirming">{{
            confirmText || $t('common.confirm')
          }}</Button>
        </div>
        <div v-if="confirmFailMsg" class="text-center text-base font-bold leading-[1.125rem] text-warning">
          {{ confirmFailMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import contentComponent from './content'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { isOpen, type, size, title, confirmAction, confirmText, cancelAction, cancelText } = storeToRefs(modalStore)
const { close, setConfirmData } = modalStore

const modalSize = computed(() => {
  if (size.value === 'lg') return 'max-w-lg'
  if (size.value === 'md') return 'max-w-md'
  if (size.value === 'sm') return 'max-w-sm'
  if (size.value === 'xs') return 'max-w-xs'
  return 'lg'
})

const component = computed(() => {
  return contentComponent[type.value]
})

const confirming = ref(false)
const confirmFailMsg = ref(null)

function checkCustomContentData() {
  confirming.value = true
  if ([MODAL_TYPE.ALERT, MODAL_TYPE.CONFIRM].includes(type.value)) {
    confirm()
  } else {
    setConfirmData((data) => {
      if (data === false) {
        confirming.value = false
      } else {
        confirm(data)
      }
    })
  }
}

async function confirm(data) {
  confirmFailMsg.value = null

  const fn = confirmAction?.value
  if (fn) {
    confirming.value = true
    try {
      const confirmResult = await fn(data)
      if (typeof confirmResult === 'string') {
        confirmFailMsg.value = confirmResult
        return
      }
    } catch (e) {
      console.warn(e)
      return
    } finally {
      confirming.value = false
    }
  } else {
    confirming.value = false
  }
  close()
}

function cancel() {
  const fn = cancelAction?.value
  if (fn) {
    const cancelResult = fn()
    if (typeof cancelResult === 'boolean' && !cancelResult) {
      return
    }
  }
  close()
}

let html = null
watch(isOpen, (v) => {
  if (!html) {
    return
  }
  if (v) {
    html.style.overflow = 'hidden'
    html.style.marginRight = '12px'
  } else {
    html.style.overflow = ''
    html.style.marginRight = ''

    confirmFailMsg.value = null
  }
})
onMounted(() => {
  html = document.getElementsByTagName('html')[0]
})
</script>
