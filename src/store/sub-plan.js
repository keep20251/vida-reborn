import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useAppStore } from '@/store/app'
import { useDialogStore } from '@/store/dialog'
import MainPage from '@comp/subPlan/MainPage.vue'
import SubPlanSet from '@comp/subPlan/SubPlanSet.vue'
import { SUB_PLAN } from '@const'

export const useSubPlanStore = defineStore('subPlan', () => {
  const { subPlanDialog } = storeToRefs(useDialogStore())
  const { appConfig } = useAppStore()
  const { userData } = storeToRefs(useAccountStore())

  const routes = [
    { value: SUB_PLAN.MAIN_PAGE, component: MainPage },
    { value: SUB_PLAN.SET, component: SubPlanSet },
  ]

  const now = ref(SUB_PLAN.MAIN_PAGE)
  const history = ref([])
  const historyProxy = computed(() => history.value)
  const subPlanComponent = computed(() => routes.find((route) => route.value === now.value).component)

  const subList = ref(userData.value.subscription_list)
  const addSubPlan = ref(false)
  const data = ref('')
  const index = ref('')
  const lastIndex = ref(null)

  const subPlanName = ref('') // 必傳
  const subPlanContent = ref('')
  const subPlanPrice = ref('') // 必傳
  const subUnlockDayAfter = ref('') // 必傳(解鎖Ｎ天前的內榮)
  const subId = ref('') // 必傳
  const status = ref('')

  const subPicture = ref('')
  const uploadFiles = ref([])
  const selDefaultItem = ref(appConfig.subscription_images[0])
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

  function close() {
    now.value = SUB_PLAN.MAIN_PAGE
    subPlanDialog.value = false
    uploadFiles.value = []
    history.value = []
  }

  function open(curr = SUB_PLAN.MAIN_PAGE) {
    now.value = curr
    subPlanDialog.value = true
  }

  return {
    subPlanComponent,
    history: historyProxy,
    to,
    back,
    close,
    open,
    addSubPlan,
    data,
    index,
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
  }
})
