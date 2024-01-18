## 基础版本

npm: 8.19.3
node: 16.19.0

## Git Commit 命名原則

1. 請以 `新增＃` `修正＃` `更新＃` `刪除＃` `重構＃` `部署＃` 開頭，後面接上該 `commit` 的簡短敘述說明。例如新增一個用戶註冊的功能，則該 `commit` 應為`新增＃用戶註冊功能`
2. 若該 `commit` 包含 `Monday` 上的 `issue`，則後面需補上該 `issue` 的編號，且須貼上該 `issue` 的簡短敘述說明。例如 `bug list` 上序號 `#1`，問題為`用戶無法註冊...`，則該 `commit` 應為`修正＃bug issue#1 用戶無法註冊`
3. 盡可能避免多個功能在同一個 `commit` 中，請分別 `commit`
4. 禁止在 `master` 中直接修改 `commit`，應在自己的分支上修改後再合併到 `master`，建議使用 `rebase` 的方式合併

## Gitlab Flow 分支開發原則

1. <font color="red">避免直接推送到 `main, prod, stag` 分支，盡可能保持只有合併操作</font>
2. 無論是開發新功能或是修正錯誤，甚至是 `Hotfix` ，都應該從 `master` 另開一個特性分支`(feature)`
3. 命名規則：主旨＋負責人名稱＋日期＋功能。例如：對活動彈窗崩潰的熱修復可以命名為`hotfix/popup-ad-dialog-crash`
4. 開發完畢後，務必先使用 `git rebase main` 對主要分支進行更新與解衝突
5. 使用 `git push -u origin {branchName}` 將分支推送到遠端
6. 由主要發版的人員進行分支合併，挑選需要被釋出的功能進行合併，使用 `git merge {branchname} --no-ff`

## 專案初始化

1. 執行 `npm install`
2. 使用 `Visual Studio Code` 開發請在`extension`（延伸模組）的輸入框輸入`@recommended` 安裝所需的開發工具
3. 執行 `npm run dev` 啟動專案
4. 把 `.env.example` 複製一份，更名為 `.env.development`，並且設定環境變數
5. Done

## 環境變數

1. 要使用 `import.meta.env` 語法取得環境變數，該變數的命名需要加入前綴 `VITE_`

```shell
# Applicaiton Name 目前僅用於<title>
VITE_APP_NAME=fantasi
# API Base URL
VITE_BASE_URL=/
```

### 環境變數子檔

1. `.env` 所有環境適用
2. `.env.development` 開發環境適用
3. `.env.production` 正式環境適用，打包時會自動引入
4. 若有特定環境，假設為 `.env.staging` ，則可以使用 `vite build --mode staging` 來打包，打包時會自動引入

## <font color="red">!!!重要提醒!!!</font>

> <font color="red">有加入或移除任何環境變數，請加入到 `.env.example` 內，並且通知其他人更新，避免因變數不足導致的開發錯誤</font>

## Package.json 命令使用

1. `npm run dev` 使用 `Vida SSR Server` 啟動開發環境
2. `npm run build` 產生Production環境的SSR打包檔案，會去讀取.env.production的環境變數
3. `npm run build:stag` 產生Stag環境的SSR打包檔案，會去讀取.env.staging的環境變數
4. `npm run pord` 根據 `npm run build` 產生的網頁來預覽 `Production` 環境
5. `npm run stag` 根據 `npm run build:stag` 產生的網頁來預覽 `Production` 環境
6. `npm run format` 使用 `Prettier` 自動化排版 `/src` 下的檔案
7. `npm run lint` 使用 `ESlint` 檢查專案內檔案是否有不符 `Elsint Vue Standard` 規範的程式碼
8. `npm run parse` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `src/i18n/locale/{countryCode}.js`
9. `npm run parse:about` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about` 下的 `json` 檔案
10. `npm run parse:select` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about/select` 下的 `json` 檔案
11. `npm run pack` 執行打包 (SSR模式下可能用不到)

## Docker 使用方式

因為第三方登入需要使用 callback 網址，所以需要有 domain 才能使用，所以在本地端開發時需要使用 `Docker` 來模擬 `Production` 環境，並掛上 `localhost` 的 domain才能通過第三方登入的驗證，以下是設定方式：

### 安裝 Docker

1. 請先安裝 [Docker Desktop](https://www.docker.com/get-started/)
2. 安裝完畢後，請先確認 `Docker Desktop` 是否有正常啟動

### 設定 hosts

1. 使用 `sudo vim /etc/hosts` 來編輯 hosts 檔案
2. 按下 `i` 進入編輯模式
3. 加入 `127.0.0.1 vida-reborn.com`
4. 按下 `esc` 鍵，輸入 `:wq` 並按下 `Enter` 來儲存並離開

### 啟動 Docker

1. `cd` 到 `/vida-reborn/docker` 資料夾，將.env.example複製一份，更名為.env，並且設定環境變數
2. 環境變數中的 `MODE` 表示目前要啟動的環境，`dev` 表示開發環境，`prod` 表示正式環境，`stag` 表示測試環境
3. 執行 `docker-compose up` 來啟動 `Docker` 環境
4. 如果要關閉 `Docker` 環境，請使用 `Ctrl + C` 來關閉
5. 如果不想一開始就查看 `log` ，可以使用 `docker-compose up -d` 來背景執行
6. 如果背景執行後想要查看容器的 `log`，可以使用 `docker-compose logs -f` 來查看
7. 如果想要移除 `Docker` 環境，可以使用 `docker-compose down` 來移除
8. 如果想要查看容器狀態，可以使用 `docker ps` 來查看
9. 如果想要進入 `Docker` 容器，可以使用 `docker exec -it {containerName} bash` 來進入，例如 `docker exec -it vida-nginx bash`

## Custom Icon 設定

#### 引入

1. 將SVG檔案放置於`src/assets/icons`資料夾內
2. 在 src/constant/icon-map.js 內新增對應的icon名稱，範例：

```javascript
export const iconMap = {
  ...
  camera: 'folder/icon-name', // icon名稱key: '資料夾名稱/檔案名稱'，不要副檔名
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

## Troubleshooting

##### Build後運行Node直接噴錯，落落長的一段找不到錯誤訊息在哪裡

1. 先找到剛剛打包的entry-server.js檔案，通常在dist或dist-stagign的server資料夾內
2. 找到該檔案的最後一行，通常會是 `export{Nn as render};`
3. 將該行拿來搜尋，這行以下顯示的就是錯誤訊息

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
