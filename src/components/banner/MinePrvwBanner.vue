<template>
  <div
    class="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-black bg-opacity-70 py-15 pr-20 sm:py-40 sm:pr-40 xl:py-40 xl:pr-40"
  >
    <div class="opacity-0">Preview</div>
    <div class="flex space-x-20 sm:space-x-25 xl:space-x-50">
      <div
        :class="{ 'text-white': isPrvwActive === 'isVisitor' }"
        @click="setActive('isVisitor')"
        class="cursor-pointer text-base font-normal leading-lg text-gray-a3"
      >
        {{ $t('info.perVisitor') }}
      </div>
      <div
        :class="{ 'text-white': isPrvwActive === 'isSubScriber' }"
        @click="setActive('isSubScriber')"
        class="cursor-pointer text-base font-normal leading-lg text-gray-a3"
      >
        {{ $t('info.perSubscriber') }}
      </div>
    </div>
    <div class="flex cursor-pointer flex-row items-center space-x-10" @click="onBack">
      <span class="text-base font-normal leading-lg text-white">{{ $t('info.exitPrvw') }}</span>
      <Icon name="closeWhite" size="15"></Icon>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'
import { useRouters } from '@use/routers'

const mineStore = useMineStore()
const { isPrvwActive } = storeToRefs(mineStore)

function setActive(role) {
  isPrvwActive.value = role
}

const emits = defineEmits(['back'])

const { back } = useRouters()
function onBack() {
  back().then(() => emits('back'))
}
</script>
