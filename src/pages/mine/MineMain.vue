<template>
  <div v-if="isLogin">
    <HomeCreator v-if="isCreator"></HomeCreator>
    <HomeRegister v-else></HomeRegister>
  </div>
  <div v-else>
    <HomeVisitor></HomeVisitor>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import HomeCreator from '@comp/mine/HomeCreator.vue'
import HomeRegister from '@comp/mine/HomeRegister.vue'
import HomeVisitor from '@comp/mine/HomeVisitor.vue'

const { isLogin, isCreator } = storeToRefs(useAccountStore())
</script>
