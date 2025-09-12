<template>
  <BaseDialog v-if="isOpen" size="sm">
        <template #default>
            
            <Button cancel @click="onAddSubscripToMineClicked">
                {{ $t('modal.sure') }}
            </Button>
        </template>
  </BaseDialog>
</template>
<script setup>
import BaseDialog from './BaseDialog.vue'
const onAddSubscripToMineClicked = ()=>{
    
}
</script>