<template>
  <div
    class="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-black bg-opacity-70 py-15 sm:py-40 xl:py-40 pr-20 sm:pr-40 xl:pr-40"
  >
    <div class="opacity-0">Preview</div>
    <div class="flex space-x-20 sm:space-x-25 xl:space-x-50">
      <div
        :class="{ 'text-white': isPrvwActive === 'isVisitor' }"
        @click="setActive('isVisitor')"
        class="cursor-pointer text-gray-a3 text-base font-normal leading-lg"
      >
        {{ $t('info.perVisitor') }}
      </div>
      <div
        :class="{ 'text-white': isPrvwActive === 'isSubScriber' }"
        @click="setActive('isSubScriber')"
        class="cursor-pointer text-gray-a3 text-base font-normal leading-lg"
      >
        {{ $t('info.perSubscriber') }}
      </div>
    </div>
    <div class="flex cursor-pointer items-center space-x-5" @click="onBack">
      <Icon name="closeWhite" size="15"></Icon>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'

const mineStore = useMineStore()
const { isPrvwActive } = storeToRefs(mineStore)

function setActive(role) {
  isPrvwActive.value = role
}

const emits = defineEmits(['back'])

const router = useRouter()
function onBack() {
  if (window.history.state.back === null) {
    router.push({ name: 'home' })
  } else {
    router.back()
  }
  emits('back')
}
</script>
