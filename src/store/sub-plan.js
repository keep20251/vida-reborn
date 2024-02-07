import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useDialogStore } from '@/store/dialog'
import SubPlanList from '@comp/subPlan/SubPlanList.vue'
import MainPage from '@comp/subPlan/MainPage.vue'
import SubPlanSet from '@comp/subPlan/SubPlanSet.vue'
import { SUB_PLAN } from '@const'


export const useSubPlanStore = defineStore('subPlan', () => {
  const { subPlanDialog } = storeToRefs(useDialogStore())

  const routes = [
    { value: SUB_PLAN.MAIN_PAGE, component: MainPage },
    { value: SUB_PLAN.LIST, component: SubPlanList },
    { value: SUB_PLAN.SET, component: SubPlanSet },
  ]

  const now = ref(SUB_PLAN.MAIN_PAGE)
  const history = ref([])
  const historyProxy = computed(() => history.value)

  const subPlanComponent = computed(() => routes.find((route) => route.value === now.value).component)

  function to(value) {
    history.value.push(now.value)
    now.value = value
  }

  function back() {
    if (history.value.length <= 0) {
      throw new Error('[Auth Route Error] History is empty, you shoud not call back()')
    }
    now.value = history.value.pop()
  }

  function close() {
    now.value = SUB_PLAN.MAIN_PAGE
    subPlanDialog.value = false
    history.value = []
  }

  function open(curr = SUB_PLAN.MAIN_PAGE) {
    now.value = curr
    subPlanDialog.value = true
  }

  return { subPlanComponent, history: historyProxy, to, back, close, open }
})
