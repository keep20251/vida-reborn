import concat from 'lodash/concat'
import flatten from 'lodash/flatten'
import sumBy from 'lodash/sumBy'
import { readonly, ref } from 'vue'
import { resizeColumns } from '@/utils/resort-columns'

/**
 * 用於建立無限滾動的排序資料
 */
export const useSortingData = () => {
  // 用於儲存排序後的資料
  const groups = ref([])

  // 用於確保"進入我的商店"的column只會被補入一次
  const oneTimeGate = ref(false)

  /**
   * 取得排序後的資料
   * @param {array} columns
   * @param {number} toShopColumn 是否要補入"進入我的商店"的column
   * @returns array
   */
  function getData(columns, toShopColumn) {
    if (toShopColumn && !oneTimeGate.value) {
      groups.value = concat(groups.value, sorting(columns, toShopColumn))
      oneTimeGate.value = true
    } else {
      groups.value = concat(groups.value, sorting(columns, null))
    }
    return flatten(groups.value)
  }

  /**
   * 清空資料
   */
  function refreshData() {
    groups.value = []
  }

  /**
   * 如果最後一行沒有被補滿，則下次取得資料時會優先補足最後一行
   * @param {array} columns 新的資料列
   * @param {number} toShopColumn 是否要補入"進入我的商店"的column
   * @returns array
   */
  function sorting(columns, toShopColumn) {
    const last = groups.value[groups.value.length - 1]
    if (sumBy(last, 'cols') < 12) {
      groups.value.splice(groups.value.length - 1, 1)
      return resizeColumns(columns, last, toShopColumn)
    }
    return resizeColumns(columns, [], toShopColumn)
  }

  return { groups: readonly(groups), getData, refreshData }
}
