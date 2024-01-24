import flatten from 'lodash/flatten'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reverse from 'lodash/fp/reverse'
import sortBy from 'lodash/fp/sortBy'
import isEmpty from 'lodash/isEmpty'
import reject from 'lodash/reject'
import remove from 'lodash/remove'
import sumBy from 'lodash/sumBy'
import { COLUMN_SHAPE, MEDIA_SHAPE } from '@const'

const MAX_COLUMNS = 12

export const resortColumns = (columns, unFullGroups = []) => {
  // 先把每個item都插入cols屬性，並依照cols由大到小排序
  const currentColumns = flow(
    map((column) => ({ ...column, cols: cols(column) })),
    sortBy('cols'),
    reverse,
  )(columns)

  // 如果有未滿的group，則優先補足未滿的group
  if (unFullGroups.length > 0) {
    unFullGroups.forEach((group) => {
      const removeIndex = []
      currentColumns.forEach((column, index) => {
        if (sumBy(group, 'cols') === MAX_COLUMNS) return false

        if (sumBy(group, 'cols') + column.cols <= MAX_COLUMNS) {
          group.push(column)
          removeIndex.push(index)
        }
      })
      // 有被補足的column就從currentColumns中移除
      console.log(`總共有${removeIndex.length}個column被拿去補足row`)
      removeIndex.forEach((index) => currentColumns.splice(index, 1))
    })
  }

  // 把剩下的column依照cols分成兩組
  const wideColumns = currentColumns.filter((column) => column.cols === 8)
  const pettyColumns = currentColumns.filter((column) => column.cols === 4)

  const result = []
  let rowTemp = []
  let ids = []

  // 先把wide的column塞進去，再塞petty的column
  wideColumns.forEach((wideColumn) => {
    if (pettyColumns.length < 1) return false

    if (sumBy(rowTemp, 'cols') + 8 <= MAX_COLUMNS) {
      rowTemp.push(wideColumn)
      ids.push(wideColumn.id)
    }

    if (sumBy(rowTemp, 'cols') + 4 <= MAX_COLUMNS) {
      const pettyColumn = pettyColumns.pop()
      rowTemp.push(pettyColumn)
    }
    if (sumBy(rowTemp, 'cols') === MAX_COLUMNS) {
      result.push(rowTemp)
      rowTemp = []
    }
  })

  // 如果wide的column都塞完了，則將使用到的column移除
  remove(wideColumns, (column) => ids.includes(column.id))
  ids = []

  // 如果有沒被排完的row，則push進result
  if (rowTemp.length > 0) {
    result.push(rowTemp)
  }

  // 沒用完的petty columns 再排成 4*3 的組合
  pettyColumns.forEach((pettyColumn) => {
    if (sumBy(rowTemp, 'cols') + 4 <= MAX_COLUMNS) {
      rowTemp.push(pettyColumn)
      ids.push(pettyColumn.id)
    }
    if (sumBy(rowTemp, 'cols') === MAX_COLUMNS) {
      result.push(rowTemp)
      rowTemp = []
    }
  })

  // 如果petty的column都塞完了，則將使用到的column移除
  remove(pettyColumns, (column) => ids.includes(column.id))
  ids = []

  // 如果有沒被排完的petty row，則push進result
  if (rowTemp.length > 0) {
    result.push(rowTemp)
  }

  // 如果最後結果是空的，則把剩下的colum各自排成一組並回傳
  if (result.length < 1) {
    const lastResult = []
    if (wideColumns.length > 0) {
      wideColumns.forEach((wideColumn) => lastResult.push([wideColumn]))
    }
    if (pettyColumns.length > 0) {
      pettyColumns.forEach((pettyColumn) => lastResult.push([pettyColumn]))
    }
    return lastResult
  }

  // 前面都處理完之後如果還有剩下，就再 recurse 一次
  if (wideColumns.length > 0 || pettyColumns.length > 0) {
    const nextResult = resortColumns([...wideColumns, ...pettyColumns])
    // 最後把多餘的空陣列清除掉
    return reject([...result, ...nextResult], isEmpty)
  } else {
    return reject(result, isEmpty)
  }
}

/**
 * 計算每個column的cols屬性，並重新分組
 * @param {Array} columns 資料列表
 * @param {Array} last 前一個列表剩下沒排完的columns
 * @param {number} toShopColumn 是否要補入"進入我的商店"的column
 * @returns Array
 */
export const resizeColumns = (columns, last = [], toShopColumn = null) => {
  const newColumns = flow(map((column) => ({ ...column, cols: cols(column) })))(columns)
  const result = []

  // 如果是在創作者頁面，第一個column要先被補進去
  let rowTemp = toShopColumn ? [{ cols: toShopColumn }, ...last] : last
  newColumns.forEach((column) => {
    let flag = 0

    if (sumBy(rowTemp, 'cols') + column.cols <= MAX_COLUMNS) {
      rowTemp.push(column)
      flag = 1
    } else {
      if (sumBy(rowTemp, 'cols') + COLUMN_SHAPE.LONG <= MAX_COLUMNS) {
        column.cols = 4
        rowTemp.push(column)
        flag = 1
      }
    }

    if (sumBy(rowTemp, 'cols') === MAX_COLUMNS) {
      result.push(rowTemp)
      rowTemp = []
      if (flag === 0) rowTemp.push(column)
    }
  })

  if (rowTemp.length > 0) result.push(rowTemp)

  // 如果是在創作者頁面，第一個一開始先被補進去，最後再將預先補入的無用column移除
  if (toShopColumn) result[0].splice(0, 1)

  const flatResult = flatten(result)
  console.log(`[resizeColumns]original: ${columns.length}, new: ${newColumns.length}, after: ${flatResult.length}`)
  return result
}

export const cols = (obj) => {
  return obj.shape === MEDIA_SHAPE.WIDE ? COLUMN_SHAPE.WIDE : COLUMN_SHAPE.LONG
}
