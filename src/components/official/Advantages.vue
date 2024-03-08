<script setup>
import { ref } from 'vue'
import AdvantagesContent from '@comp/official/AdvantagesContent.vue'

const advantages = ref([
  {
    id: 1,
    title: 'Commission-Free',
    subtitle: '0% fees, 100% satisfaction',
    desc: 'Vida is the best comprehensive platform for creators, offering a wide array of solutions to meet your specific needs. On Vida, creators receive 100% of funds from their fans without any commission being deducted.',
  },
  {
    id: 2,
    title: 'Crowdfunding',
    subtitle: 'Fueling success through fans',
    desc: 'Introducing the innovative concept of crowdfunding. Within this realm, creators wield the ability to tailor their sponsorship plans, while fans enjoy the autonomy to select their preferred level of support, thereby seamlessly integrating themselves into the very fabric of the creative blueprint.',
  },
  {
    id: 3,
    title: 'Brand Strategy: ',
    subtitle: 'Expand your reach',
    desc: 'Our team of experts are here to help you excel. They will help you devise and implement comprehensive social communication and optimisation strategies to improve interaction and engagement within your community.',
  },
  {
    id: 4,
    title: 'Multifunctional Modules: ',
    subtitle: 'Your personal touch',
    desc: 'We offer creators an exceptionally flexible feature design that empowers you to effortlessly oversee your community of fans, organize your works into categories, and establish subscription and payment preferences.',
  },
])
</script>
<template>
  <div class="mx-17 my-80 grid max-w-7xl grid-cols-1 p-2 sm:mx-auto sm:grid-cols-4">
    <AdvantagesContent
      class="mt-20 sm:mx-58"
      v-for="advantage in advantages"
      :key="advantage.id"
      :title="advantage.title"
      :subtitle="advantage.subtitle"
      :desc="advantage.desc"
    />
  </div>
</template>
<style lang="scss" scoped></style>
