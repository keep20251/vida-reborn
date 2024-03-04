<template>
  <div v-show="isOpen" class="fixed top-0 z-50 h-full w-full overflow-hidden bg-black bg-opacity-70">
    <div class="flex h-full items-center justify-center">
      <div
        class="relative m-100 mx-20 flex w-full flex-col items-center rounded-xl bg-white px-36 py-30"
        :class="[modalSize]"
      >
        <div v-if="!!title" class="mb-20 text-center font-bold leading-lg" :class="[titleFontSize]">
          {{ title !== null ? $t(title) : '' }}
        </div>
        <div v-if="!!imageTitle" class="absolute -top-50 flex w-full items-center justify-center">
          <EncryptImage :src="imageTitle" :border-radius="15" :width="180" :height="120" cover></EncryptImage>
        </div>
        <div v-if="!!avatarTitle" class="absolute -top-50 flex w-full items-center justify-center">
          <EncryptImage :src="avatarTitle" :radius="60" cover></EncryptImage>
        </div>
        <div v-if="showClose" class="absolute right-20 top-20 cursor-pointer" @click="close">
          <Icon name="close" size="20"></Icon>
        </div>
        <div class="mb-20 max-h-[30.5rem] w-full" :class="{ 'mt-50': !!imageTitle || !!avatarTitle }">
          <keep-alive :max="5">
            <component :is="component" @component:confirm="checkCustomContentData"></component>
          </keep-alive>
        </div>
        <div class="flex w-full space-x-8">
          <Button v-if="cancelAction" @click="tryExecute(cancelAction)" cancel :disabled="confirming">
            {{ cancelText || $t('common.cancel') }}
          </Button>
          <Button v-if="otherAction" @click="tryExecute(otherAction)" contrast :disabled="confirming">
            {{ otherText || $t('common.getAround') }}
          </Button>
          <Button
            v-if="showConfirm"
            @click="checkCustomContentData"
            :loading="confirming"
            :gradient="!!gradientConfirm"
          >
            {{ confirmText || $t('common.confirm') }}
          </Button>
        </div>
        <div v-if="confirmFailMsg" class="text-center text-base font-bold leading-lg text-warning">
          {{ confirmFailMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'
import contentComponent from './content'

const modalStore = useModalStore()
const {
  isOpen,
  type,
  size,
  title,
  imageTitle,
  avatarTitle,
  confirmAction,
  confirmText,
  cancelAction,
  cancelText,
  otherAction,
  otherText,
  showClose,
  showConfirm,
  gradientConfirm,
  nextAction,
} = storeToRefs(modalStore)
const { close, setConfirmData } = modalStore

const large = ['lg', 'xl']
const titleFontSize = computed(() => (large.includes(size.value) ? 'text-lg' : 'text-base'))

const modalSize = computed(() => {
  switch (size.value) {
    case 'xs':
      return 'max-w-xs' // 320px
    case 'sm':
      return 'max-w-sm' // 384px
    case 'md':
      return 'max-w-md' // 448px
    case 'lg':
      return 'max-w-lg' // 512px
    case 'xl':
      return 'max-w-xl' // 576px
    default:
      return 'lg'
  }
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
  let actionResult = false

  if (fn) {
    confirming.value = true
    try {
      const isAsync = fn.constructor.name === 'AsyncFunction'
      const confirmResult = isAsync ? await fn(data) : fn(data)
      if (typeof confirmResult === 'string') {
        confirmFailMsg.value = confirmResult
        return
      }
      actionResult = true
    } catch (e) {
      console.warn(e)
    } finally {
      confirming.value = false
    }
  } else {
    confirming.value = false
  }
  close()

  if (actionResult) {
    nextAction.value && (await nextAction.value())
    nextAction.value = null
  }
}

async function tryExecute(fn) {
  if (!fn) return
  try {
    await fn()
  } catch (e) {
    console.warn(e)
  } finally {
    close()
  }
}

const appStore = useAppStore()
const { isDesktop } = storeToRefs(appStore)
let html = null
watch(isOpen, (v) => {
  if (!html) {
    return
  }
  if (v) {
    html.style.overflow = 'hidden'
    if (isDesktop.value) html.style.marginRight = '15px'
  } else {
    html.style.overflow = ''
    if (isDesktop.value) html.style.marginRight = ''

    confirmFailMsg.value = null
  }
})
onMounted(() => {
  html = document.getElementsByTagName('html')[0]
})
</script>
