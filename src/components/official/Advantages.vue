<script setup>
import { ref } from 'vue'
import AdvantagesContent from '@comp/official/AdvantagesContent.vue'

const advantages = ref([
  {
    id: 1,
    title: 'Commission-Free',
    subtitle: '0% fees, 100% satisfaction',
    desc: 'Vida is the best comprehensive platform for creators, offering a wide array of solutions to meet your specific needs. On Vida, creators receive 100% of funds from their fans without any commission being deducted.',
    active: true,
  },
  {
    id: 2,
    title: 'Crowdfunding',
    subtitle: 'Fueling success through fans',
    desc: 'Introducing the innovative concept of crowdfunding. Within this realm, creators wield the ability to tailor their sponsorship plans, while fans enjoy the autonomy to select their preferred level of support, thereby seamlessly integrating themselves into the very fabric of the creative blueprint.',
    active: false,
  },
  {
    id: 3,
    title: 'Brand Strategy: ',
    subtitle: 'Expand your reach',
    desc: 'Our team of experts are here to help you excel. They will help you devise and implement comprehensive social communication and optimisation strategies to improve interaction and engagement within your community.',
    active: false,
  },
  {
    id: 4,
    title: 'Multifunctional Modules: ',
    subtitle: 'Your personal touch',
    desc: 'We offer creators an exceptionally flexible feature design that empowers you to effortlessly oversee your community of fans, organize your works into categories, and establish subscription and payment preferences.',
    active: false,
  },
])

const contentClick = (id) => {
  advantages.value = advantages.value.map((advantage) => ({ ...advantage, active: advantage.id === id }))
}
</script>
<template>
  <div class="mx-auto my-80 grid grid-cols-1 sm:mx-auto sm:grid-cols-4">
    <AdvantagesContent
      v-for="advantage in advantages"
      :key="advantage.id"
      :id="advantage.id"
      :title="advantage.title"
      :subtitle="advantage.subtitle"
      :desc="advantage.desc"
      :active="advantage.active"
      @contentClick="contentClick"
    />
  </div>
</template>
<style lang="scss" scoped></style>
