# 頁面標頭

## 使用 Head Component

1. `divider` 沒給就不會出現
2. `feature-icon=“moreHorizontal”` 沒給就不會出現

```html
<!-- 使用方式 -->
<head
  :title=""
  divider
  feature-icon="“moreHorizontal”"
  @back="“內部會自己call"
  router
  這邊通知上來是讓外面自己有額外的事情要做”
  @feature="“右邊功能按下”"
></head>
```