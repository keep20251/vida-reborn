# 支付相關文件

## 新增支付選項

### 1. 新增支付選項 PAYMENT_GROUP.KEY

先跟後端約定好支付選項的 `payment_type` 代碼，然後在 `@/constant/payment.js` 中的 `PAYMENT_GROUP` 裡新增對應的支付選項。

> [!WARNING]
> 注意在設置 @/constant/payemnt.js 的 PAYMENT_GROUP 時，名稱必須為全大寫，並且斷字中間以底線 `_` 連接。
> 在支付選項的滑塊中會自動將底線 `_` 轉換成小駝峰式命名法，並且自動尋找對應的 i18n 文案。
> 所以像是 `PAYMENT_GROUP.UNION_PAY` 會自動轉換成 `unionPay`，並且尋找 `payment.payway.unionPay` 的 i18n 文案。
> 因此命名時注意 @/constant/payment.js PAYMENT_GROUP.key 的命名是否符合規範。
> 同時也要注意 i18n 文案是否能對應支付選項的Key值。

### 2. 新增支付選項 ICON
將新增的支付選項的圖檔放在 `@/assets/images/payment/payway` 資料夾內

### 3. 在 PopupPayment.vue 對 paymentMap 加入新的支付選項

### 4. 加入 i18n 文案
在 `@/locales/{locale}.js` 中加入新的支付選項的 i18n 文案


::: code-group

```javascript:line-numbers [@/constant/payment.js]
export const PAYMENT_GROUP = {
  OTHER: 0, // 這個不是後端綁定的，是前端自己定義的
  ALI_PAY: 1,
  LINE_PAY: 2,
  PAYPAL: 3,
  UNION_PAY: 4,
  CREDIT_CARD: 5,
  // [!code focus:2]
  USDT: 6, // [!code ++]
}
```


```vue:line-numbers [PopupPayment.vue]
<script setup>
import AliPayImg from '@/assets/images/payment/payway/ali-pay.png'
import UnionPayImg from '@/assets/images/payment/payway/union-pay.png'
// [!code focus:2]
import USDTImg from '@/assets/images/payment/payway/usdt.png' // [!code ++]
import { PAYMENT_GROUP } from '@/constant/payment'

const paymentMap = {
  [PAYMENT_GROUP.ALI_PAY]: { img: AliPayImg, title: 'payment.popup.ali.title' },
  [PAYMENT_GROUP.UNION_PAY]: { img: UnionPayImg, title: 'payment.popup.union.title' },
  // [!code focus:2]
  [PAYMENT_GROUP.USDT]: { img: USDTImg, title: 'payment.popup.usdt.title' }, // [!code ++]
  [PAYMENT_GROUP.OTHER]: { img: null, title: 'payment.popup.other.title' },
}
</script>
```

```javascript:line-numbers [zh-tw.js]
payment: {
    title: '選擇支付方式',
    payway: { 
      aliPay: '支付寶',
      unionPay: '銀聯卡',
      creditCard: '銀行卡',
      other: '其他',
      // [!code focus:2]
      usdt: 'USDT' // [!code ++]
    },
    popup: {
      ali: { title: '已選擇支付寶' },
      union: { title: '已選擇銀聯卡' },
      other: { title: '已選擇其他' },
      // [!code focus:2]
      usdt: { title: '已選擇USDT(TRC)' }, // [!code ++]
      info: '提交後，您將被跳轉，在新的頁面安全地完成後續步驟。',
    },
    error: { amountRange: "支付金額須介於 {'$'}{min}至{max}之間" }
    ...
}
```
:::