## 基础版本

npm: 8.19.3
node: 16.19.0

## 專案文件參考
[Git Commit 與 分支規範](docs/git.md)
[i18n 語言包設定 與 更新](docs/i18n.md)
[Docker 與 本地 hosts 設定](docs/docker.md)
[客製化 icon 設定](docs/icon.md)
[排錯處理](docs/trouble-shooting.md)
[是否SSR頁面邏輯](docs/ssr.md)

### 組件文件參考
[Modal](docs/component/modal.md)
[Head](docs/component/head.md)

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
2. `npm run dev:ssl` 同上，但是搭配 `https` 安全憑證，僅限 `Docker` 使用
3. `npm run build` 產生`Production`環境的SSR打包檔案，會去讀取`.env.production`的環境變數
4. `npm run build:stag` 產生`Stag`環境的`SSR`打包檔案，會去讀取`.env.staging`的環境變數
5. `npm run pord` 根據 `npm run build` 產生的網頁來預覽 `Production` 環境
6. `npm run pord:ssl` 同上，但是搭配 `https` 安全憑證，僅限 `Docker` 使用
7. `npm run stag` 根據 `npm run build:stag` 產生的網頁來預覽 `Production` 環境
8. `npm run stag:ssl` 同上，但是搭配 `https` 安全憑證，僅限 `Docker` 使用
9. `npm run format` 使用 `Prettier` 自動化排版 `/src` 下的檔案
10. `npm run lint` 使用 `ESlint` 檢查專案內檔案是否有不符 `Elsint Vue Standard` 規範的程式碼
11. `npm run parse` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `src/i18n/locale/{countryCode}.js`
12. `npm run parse:about` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about` 下的 `json` 檔案
13. `npm run parse:select` 可讀取一個絕對位置的`csv`檔案，會自動解析成 `public/about/select` 下的 `json` 檔案
14. `npm run publish` 輸入版號、環境，會自動產生部署相關文件，放在`/reports`下
