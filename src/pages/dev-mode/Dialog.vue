<template>
  <Page>
    <template #default>
      <div class="m-20">
        <div v-for="i in 100" :key="`test-regoin-${i}`">Hello Dialog</div>
        <Button @click="showDialog = true"> Show Dialog </Button>
        <BaseDialog v-if="showDialog">
          <template #default>
            <div class="relative">
              <div class="absolute right-20 top-20 cursor-pointer" @click="showDialog = false">
                <Icon name="close"></Icon>
              </div>
              <div class="flex flex-col space-y-16 p-16 pt-48 text-center last:mb-32">
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
                <div>This is a Dialog Example</div>
              </div>
            </div>
          </template>
        </BaseDialog>
      </div>
    </template>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import Button from '@comp/common/Button.vue'
import BaseDialog from '@comp/dialog/BaseDialog.vue'

const showDialog = ref(false)
</script>
