<template>
  <Page>
    <template #default>
      <div class="m-20">
        <button
          class="rounded-[1.125rem] bg-primary px-45 py-10 text-sm font-bold leading-[0.875rem] text-white"
          @click="authDialog = true"
        >
          Show Dialog
        </button>
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
