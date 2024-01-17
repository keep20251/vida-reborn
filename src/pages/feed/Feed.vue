<template>
  <Page>
    {{ '這是帖子頁: ' + route.name + ' - ' + route.params.username + ' - ' + route.params.feedId }}
  </Page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
