import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import useRequest from '@use/request'
import { addDays, toDateYmd } from '@/utils/string-helper'

export const useEarnStore = defineStore('earn', () => {
  const { userData } = storeToRefs(useAccountStore())
  const balance = ref(userData.value.money)
  const startDate = ref(addDays(-7))
  const endDate = ref(new Date())

  // MineEarn的刷新整體表現數據
  const overallData = ref(null)

  // 刷新整體表現
  async function refreshOverallData() {
    const data = {
      start_time: toDateYmd(startDate.value),
      end_time: toDateYmd(endDate.value),
    }
    const { execute: getOverallData } = useRequest('User.stats')
    try {
      overallData.value = await getOverallData(data)
      console.log('你送出refreshOverallData')
    } catch (e) {
      console.error(e)
    }
  }

  return {
    balance,
    startDate,
    endDate,
    overallData,
    refreshOverallData,
  }
})
