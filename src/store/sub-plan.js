import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useDialogStore } from '@/store/dialog'
import Detail from '@comp/subPlan/Detail.vue'
import MainPage from '@comp/subPlan/MainPage.vue'
import SubPlanSet from '@comp/subPlan/SubPlanSet.vue'
import { SUB_PLAN } from '@const'
import { useEscapeClose } from '@/compositions/utils/escape-close'

export const useSubPlanStore = defineStore('subPlan', () => {
  const { subPlanDialog } = storeToRefs(useDialogStore())
  const { userData, isCreator } = storeToRefs(useAccountStore())

  const routes = [
    { value: SUB_PLAN.MAIN_PAGE, component: MainPage },
    { value: SUB_PLAN.SET, component: SubPlanSet },
    { value: SUB_PLAN.DETAIL, component: Detail },
  ]

  const now = ref(SUB_PLAN.MAIN_PAGE)
  const history = ref([])
  const historyProxy = computed(() => history.value)
  const subPlanComponent = computed(() => routes.find((route) => route.value === now.value).component)

  const _initItemValue = {
    id: 0,
    name: '',
    content: '',
    price: 0,
    unlock_day_after_subscribe: 99999, // 設置為很大的數值表示無限制
    expire_days: 30,
    picture: '',
    status: 0,
  }

  const addSubPlan = ref(false)
  const subList = computed(() => (isCreator.value ? userData.value.subscription_list : []))

  const currentSubItem = ref(_initItemValue)
  const setCurrentSubItem = (subItem) => (currentSubItem.value = { ...currentSubItem.value, ...subItem })
  const clearCurrentSubItem = () => (currentSubItem.value = _initItemValue)

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

  const { push, remove } = useEscapeClose()
  const subPlanDialogKey = '__SUB_PLAN_DIALOG'

  function close() {
    now.value = SUB_PLAN.MAIN_PAGE
    subPlanDialog.value = false
    history.value = []
    remove(subPlanDialogKey)
  }

  function open(curr = SUB_PLAN.MAIN_PAGE) {
    now.value = curr
    subPlanDialog.value = true
    push({ key: subPlanDialogKey, target: subPlanDialog, fn: close })
  }

  /**
   * 以下這邊都是訂閱詳情的狀態
   */
  const activeSubscription = ref(null)
  const _subscriptions = ref([])

  /**
   * 打開訂閱詳情
   * @param {Object} detailConfig
   * @param {Object} detailConfig.activeSubscription - 當前訂閱方案
   * @param {Array} detailConfig.subscriptions - 訂閱方案列表
   */
  const openDetail = (detailConfig = { activeSubscription: {}, subscriptions: [] }) => {
    activeSubscription.value = detailConfig.activeSubscription
    _subscriptions.value = detailConfig.subscriptions
    to(SUB_PLAN.DETAIL)
  }

  const addPlan = () => {
    addSubPlan.value = true
    to(SUB_PLAN.SET)
  }
  const editPlan = (subItem) => {
    addSubPlan.value = false
    setCurrentSubItem(subItem)
    to(SUB_PLAN.SET)
  }

  return {
    subPlanComponent,
    history: historyProxy,
    to,
    back,
    close,
    open,
    addSubPlan,
    subList,

    subscriptions: readonly(_subscriptions),
    activeSubscription,
    openDetail,
    addPlan,
    editPlan,

    currentSubItem: readonly(currentSubItem),
    setCurrentSubItem,
    clearCurrentSubItem,
  }
})
