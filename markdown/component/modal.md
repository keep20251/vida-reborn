## Modal 彈跳視窗

1. 在 `@comp/modal/Text.vue` 中新增檔案，檔案為該視窗內容
2. 在 `@/constant/index.js` 的 `MODAL_TYPE` 新增對應的 `key` ，範例：

```javascript
export const MODAL_TYPE = {
  TEST: 999,
}
```

3. 在 `@comp/modal/content/index.js` 中新增 2. 的 `key` 對應的 `component` ，範例：

```javascript
import { MODAL_TYPE } from '@const'
import Text from './Text.vue'

export default Object.freeze({
  [MODAL_TYPE.TEST]: Test,
})
```

4. 在要使用彈窗的地方，引入 `useModalStore` 和 `MODAL_TYPE`

```html
<div @click="customModal('lg')">lg</div>
```

```javascript
import { useModalStore } from '@/store/modal'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { open } = modalStore

function customModal(size) {
  open(MODAL_TYPE.TEST, {
    size,
    title: '測試彈窗',
    confirmAction: (data) => {
      console.log('我還可以在這邊繼續非同步')
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(data)
          resolve()
        }, 2000)
      })
    },
    cancelAction: () => {},
  })
}
```