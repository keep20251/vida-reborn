<template>
  <div class="flex flex-col space-y-5">
    <div v-if="isLoading" class="animate-pulse-none flex flex-col space-y-10">
      <div class="h-35 w-full rounded-xl bg-gray-cc"></div>
      <div class="h-35 w-full rounded-xl bg-gray-cc"></div>
    </div>
    <div v-else>
      <keep-alive>
        <component
          v-model="currentCard"
          :cards="creditCardList"
          :is="activeComponent"
          @complete="(res) => emits('complete', res)"
          @add:card="onCardAdd"
          :back="back"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
import { computed, onActivated, onDeactivated } from 'vue'
import { storeToRefs } from 'pinia'
import { usePaymentStore } from '@/store/payment'
import { useExecutionLock } from '@/compositions/utils/execution-lock'
import AddCard from './AddCard.vue'
import CardList from './CardList.vue'

const props = defineProps({
  cardAddAction: { type: Function, required: true },
  back: { type: Boolean, required: true },
})

const emits = defineEmits(['complete', 'back:close'])

const paymentStore = usePaymentStore()
const { getCreditCardList } = paymentStore
const { defaultCard, creditCardList, currentCard } = storeToRefs(paymentStore)

const activeComponent = computed(() => (!!defaultCard.value && !props.back ? CardList : AddCard))

const onCardAdd = () => props.cardAddAction && props.cardAddAction()

const { disabled: isLoading, onExecute } = useExecutionLock()
onActivated(() => onExecute(async () => await getCreditCardList()))
onDeactivated(() => emits('back:close'))
</script>
