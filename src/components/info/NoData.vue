<template>
  <div class="flex flex-col items-center justify-center pt-50">
    <!-- <img class="h-30 w-54 xl:h-40 xl:w-72" src="@/assets/logo.svg?url" alt="VIDA" /> -->
    <div class="flex w-full grow flex-col items-center justify-center space-y-36">
      <img class="h-[12.5rem] w-[12.5rem]" src="@/assets/images/no-data.svg?url" alt="Error" />
      <span class="text-lg font-medium">{{ $t('content.noData') }}</span>
      <div class="w-1/2">
        <Button v-if="reload" @click="onReload">{{ $t('common.reload') }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@comp/common/Button.vue'

const props = defineProps({
  reload: { type: Function },
})

function onReload() {
  if (props.reload) {
    props.reload()
  }
}
</script>
