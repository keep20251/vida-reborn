<template>
  <div class="flex flex-col space-y-5">
    <keep-alive>
      <component
        :is="activeComponent"
        @complete="(res) => emits('complete', res)"
        @add:card="onCardAdd"
        :card-add-action="cardAddAction"
        :back="back"
      ></component>
    </keep-alive>
  </div>
</template>
<script setup>
import { computed, onDeactivated, ref } from 'vue'
import AddCard from './AddCard.vue'
import CardList from './CardList.vue'

const props = defineProps({
  cardAddAction: { type: Function, required: true },
  back: { type: Boolean, required: true },
})

const emits = defineEmits(['complete', 'back:close'])

const cardAlreadyExist = ref(true)
const activeComponent = computed(() => (cardAlreadyExist.value && !props.back ? CardList : AddCard))

const onCardAdd = () => {
  console.log('onCardAdd')
  props.cardAddAction && props.cardAddAction()
}

onDeactivated(() => {
  emits('back:close')
})
</script>
