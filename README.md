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
5. 4. `npm run stag` 根據 `npm run build:stag` 產生的網頁來預覽 `Production` 環境
6. `npm run format` 使用 `Prettier` 自動化排版 `/src` 下的檔案
7. `npm run lint` 使用 `ESlint` 檢查專案內檔案是否有不符 `Elsint Vue Standard` 規範的程式碼
8. `npm run parse` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `src/i18n/locale/{countryCode}.js`
9. `npm run parse:about` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about` 下的 `json` 檔案
10. `npm run parse:select` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about/select` 下的 `json` 檔案
11. `npm run pack` 執行打包 (SSR模式下可能用不到)
