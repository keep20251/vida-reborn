<template>
  <Page>
    <ClientOnly>
      <div>ClientOnly</div>
      <template #fallback>
        <div>This is for SSR/SEO</div>
      </template>
    </ClientOnly>
  </Page>
</template>

<script setup>
import ClientOnly from '@/components/common/ClientOnly'
</script>

<style lang="scss" scoped></style>
