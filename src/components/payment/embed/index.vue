<template>
  <div class="flex flex-col space-y-5">
    <div v-if="!isLoading">
      <keep-alive>
        <component
          :card="defaultCard"
          :is="activeComponent"
          @complete="(res) => emits('complete', res)"
          @add:card="onCardAdd"
          :card-add-action="cardAddAction"
          :back="back"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
import { computed, onActivated, onDeactivated, onMounted, ref, watch } from 'vue'
import useRequest from '@use/request'
import AddCard from './AddCard.vue'
import CardList from './CardList.vue'

const props = defineProps({
  cardAddAction: { type: Function, required: true },
  back: { type: Boolean, required: true },
})

const emits = defineEmits(['complete', 'back:close'])

const { data, execute, isLoading } = useRequest('Payment.getCardList', { params: {} })
const cardAlreadyExist = ref(false)

const activeComponent = computed(() => (cardAlreadyExist.value && !props.back ? CardList : AddCard))
const onCardAdd = () => {
  console.log('onCardAdd')
  props.cardAddAction && props.cardAddAction()
}

onActivated(() => {
  cardAlreadyExist.value = false
  execute()
})

const defaultCard = computed(() => data.value?.find((card) => card.is_default)?.card || null)

watch(
  data,
  (newData) => {
    console.log('watch data', newData)
    console.log('watch data', newData)
    console.log('watch data', newData)
    cardAlreadyExist.value = newData != null
    if (!newData) return

    const targetCard = newData.find((card) => card.is_default) || null
    const cardObj = { ...targetCard.card, id: targetCard.id }

    if (cardAlreadyExist.value) emits('cardload', cardObj)
  },
  { immediate: true, deep: true },
)

onDeactivated(() => {
  emits('back:close')
  cardAlreadyExist.value = false
})
</script>
