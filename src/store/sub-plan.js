import { computed, readonly, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import Detail from '@comp/subPlan/Detail.vue'
import MainPage from '@comp/subPlan/MainPage.vue'
import SubPlanSet from '@comp/subPlan/SubPlanSet.vue'
import { SUB_PLAN } from '@const'
import { useEscapeClose } from '@/compositions/utils/escape-close'

export const useSubPlanStore = defineStore('subPlan', () => {
  const { subPlanDialog } = storeToRefs(useDialogStore())
  const { appConfig } = useAppStore()
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

  const subList = computed(() => {
    return isCreator.value ? userData.value.subscription_list : []
  })

  const addSubPlan = ref(false)
  const lastIndex = ref(0)

  const _initItemValue = {
    id: 0,
    name: '',
    content: '',
    price: 0,
    unlock_day_after_subscribe: 30,
    expire_days: 30,
    picture: '',
    status: 0,
  }
  const currentSubList = ref([])
  const currentIndex = ref(0)

  const currentSubItem = ref(_initItemValue)
  const setCurrentSubItem = (subItem) => {
    console.log(`setCurrentSubItem`, subItem)
    currentSubItem.value = subItem
  }
  const clearCurrentSubItem = () => setCurrentSubItem(_initItemValue)

  const subPlanName = ref('') // 必傳
  const subPlanContent = ref('')
  const subPlanPrice = ref('') // 必傳
  const subUnlockDayAfter = ref('') // 必傳(解鎖Ｎ天前的內榮)
  const subId = ref('') // 必傳
  const status = ref('')

  const subPicture = ref('')
  const uploadFiles = ref([]) // 上傳的檔案，編輯時是封面圖
  const selDefaultItem = ref(appConfig.subscription_images[0]) // 預設封面，初始用第一張，編輯時用目前的封面
  const selUploadItem = ref(null)

  function to(value) {
    history.value.push(now.value)
    now.value = value
  }

  function back() {
    if (history.value.length <= 0) {
      throw new Error('[Auth Route Error] History is empty, you shoud not call back()')
    }
    uploadFiles.value = []
    now.value = history.value.pop()
  }

  const { push, remove } = useEscapeClose()
  const subPlanDialogKey = '__SUB_PLAN_DIALOG'

  function close() {
    now.value = SUB_PLAN.MAIN_PAGE
    subPlanDialog.value = false
    uploadFiles.value = []
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

  return {
    subPlanComponent,
    history: historyProxy,
    to,
    back,
    close,
    open,
    addSubPlan,
    currentSubList,
    currentIndex,
    subList,
    lastIndex,
    status,
    subPlanName,
    subPlanContent,
    subPlanPrice,
    subUnlockDayAfter,
    subId,
    subPicture,
    uploadFiles,
    selDefaultItem,
    selUploadItem,

    subscriptions: readonly(_subscriptions),
    activeSubscription,
    openDetail,

    currentSubItem: readonly(currentSubItem),
    setCurrentSubItem,
    clearCurrentSubItem,
  }
})
