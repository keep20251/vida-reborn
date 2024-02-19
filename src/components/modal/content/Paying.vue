<template>
  <div>
    <Loading></Loading>
  </div>
</template>
<script setup>
import { useConfirmData } from '@use/modal/confirm-data'

useConfirmData(() => {
  return true
})
</script>
