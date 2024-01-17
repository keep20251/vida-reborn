import { useMineStore } from '@/store/mine'

/** 判斷進入的頁面是不是Mine，並更換 title */
export default (to, from, failure) => {
  if (to.name.includes('mine')) {
    const { updateTitle } = useMineStore()
    updateTitle(to.name)
    console.log('after mine title')
  }
}
