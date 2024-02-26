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