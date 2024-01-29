<template>
  <div class="fixed left-0 top-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 py-30">
    <div class="flex space-x-50">
      <div
        :class="{ 'text-white': isPrvwActive === 'isVisitor' }"
        @click="setActive('isVisitor')"
        class="cursor-pointer text-gray-a3"
      >
        {{ $t('info.perVisitor') }}
      </div>
      <div
        :class="{ 'text-white': isPrvwActive === 'isSubScriber' }"
        @click="setActive('isSubScriber')"
        class="cursor-pointer text-gray-a3"
      >
        {{ $t('info.perSubscriber') }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useMineStore } from '@/store/mine'

const mineStore = useMineStore()
const { isPrvwActive } = storeToRefs(mineStore)

function setActive(role) {
  isPrvwActive.value = role
}
</script>
