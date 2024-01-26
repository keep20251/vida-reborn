<template>
  <div>
    <div v-if="isLogin">
      <HomeCreator v-if="isPermission"></HomeCreator>
      <HomeRegister v-else></HomeRegister>
    </div>
    <div v-else>
      <HomeVisitor></HomeVisitor>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import HomeCreator from '@comp/mine/HomeCreator.vue'
import HomeRegister from '@comp/mine/HomeRegister.vue'
import HomeVisitor from '@comp/mine/HomeVisitor.vue'

const { isLogin, userData } = storeToRefs(useAccountStore())

const isPermission = computed(() => {
  if (userData.value?.auth_status === 2) {
    return true
  } else {
    return false
  }
})
</script>
