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
import ClientOnly from '@comp/common/ClientOnly'
</script>
