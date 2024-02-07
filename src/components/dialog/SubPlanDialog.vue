<template>
  <BaseDialog noPadding="true" @click:around="subPlanDialog = false">
    <template #default>
      <keep-alive>
        <component :is="subPlanComponent"></component>
      </keep-alive>
    </template>
  </BaseDialog>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import { useSubPlanStore } from '@/store/sub-plan'
import BaseDialog from '@comp/dialog/BaseDialog.vue'

const { subPlanDialog } = storeToRefs(useDialogStore())

const subPlan = useSubPlanStore()
const { subPlanComponent } = storeToRefs(subPlan)
</script>
