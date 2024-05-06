## Custom Icon 設定

#### 引入

1. 將SVG檔案放置於`src/assets/icons`資料夾內
2. 在 src/constant/icon-map.js 內新增對應的icon名稱，範例：

```javascript
export const iconMap = {
  ...
  /**
   * key: icon 名稱
   * path: '資料夾名稱/檔案名稱'，不要副檔名
   * preload(optional): 是否在 Client 端預先載入，可以不給
   */
  camera: { path: 'folder/icon-name', preload: true }, 
}
```

#### 使用

目前已經將 `Icon.vue` 在 `main.js` 全域載入，所以不需要特別 import

```html
<!-- 使用方式 -->
<!-- size預設為16 -->
<!-- name需要對應custom-icon.js的customSvgNameToComponent -->
<!-- shadow陰影預設關閉 -->
<Icon size="20" name="camera" :shadow="true"></Icon>
```