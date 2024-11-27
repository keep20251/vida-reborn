# 疑難雜症

## Build後運行Node直接噴錯，落落長的一段找不到錯誤訊息在哪裡

1. 先找到剛剛打包的entry-server.js檔案，通常在dist或dist-stagign的server資料夾內
2. 找到該檔案的最後一行，通常會是 `export{Nn as render};`
3. 將該行拿來搜尋，這行以下顯示的就是錯誤訊息