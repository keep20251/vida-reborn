<template>
  <Page>{{ '這是創作者頁: ' + route.name + ' - ' + route.params.username }}</Page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
