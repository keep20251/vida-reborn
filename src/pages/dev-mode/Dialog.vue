<template>
  <Page>
    <template #default>
      <div>
        <button class="mx-16 my-8 bg-slate-400 px-16 py-8" @click="authDialog = true">Show Dialog</button>
        <AuthDialog v-if="authDialog"></AuthDialog>
      </div>
    </template>
  </Page>
</template>
<script setup>
import AuthDialog from '@/components/dialog/AuthDialog.vue'
import { useDialogStore } from '@/store/dialog'
import { storeToRefs } from 'pinia'

const { authDialog } = storeToRefs(useDialogStore())
</script>
