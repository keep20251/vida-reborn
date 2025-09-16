<template>
  <BaseDialog v-if="isOpen" size="sm" no-padding @click:around="close">
    <template #default>
      <div class="h-full w-full rounded-xl">
        <div class="relative flex w-full items-center justify-center rounded-t-xl bg-primary py-16">
          <div class="text-lg font-bold leading-lg text-white">
            {{ $t('dialog.alreadySubscribed.title') }}
          </div>
          <div class="absolute right-0 top-0 cursor-pointer px-15 pb-10 pt-15" @click="close">
            <Icon name="closeWhite" size="20"></Icon>
          </div>
        </div>
        <div class="flex flex-col space-y-20 p-20">
          <div class="text-center">
            <div class="mb-10 text-base font-normal">
              {{ $t('dialog.alreadySubscribed.content1') }}
            </div>
            <div class="text-base font-normal">
              {{ $t('dialog.alreadySubscribed.content2', { creator: creatorName }) }}
            </div>
          </div>
          <div class="text-center">
            <div class="mb-10 text-base font-normal">
              {{ $t('dialog.alreadySubscribed.order1') }}
            </div>
            <div class="text-base font-normal">
              {{ $t('dialog.alreadySubscribed.order2', { creator: creatorName }) }}
            </div>
          </div>
          <div class="flex justify-center">
            <Button @click="onAddSubscripToMineClicked">
              {{ $t('dialog.alreadySubscribed.button') }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAlreadySubscribedDialogStore } from '@/store/already-subscribed-dialog'
import Button from '@/components/common/Button.vue'
import Icon from '@/components/common/Icon.vue'
import BaseDialog from './BaseDialog.vue'

const store = useAlreadySubscribedDialogStore()
const { isOpen, creatorName } = storeToRefs(store)
const { close } = store

const onAddSubscripToMineClicked = () => {
  close()
}
</script>
