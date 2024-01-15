<template>
  <Page>
    <div class="my-10 px-20">
      <div class="mb-10">【 Creator Recommended Card 】</div>
      <RecCard :items="items"></RecCard>
    </div>
  </Page>
</template>
<script setup>
import { ref } from 'vue'
import RecCard from '@comp/card/RecCard.vue'
const items = ref([
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938, id: 1 },
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938, id: 2 },
  { creator_name: 'Cursed_ellie', creator_acc: 'cursed_ellie', posts: 134, sub_member: 1938, id: 3 },
])
</script>
