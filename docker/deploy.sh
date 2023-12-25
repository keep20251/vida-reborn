if [ -z "$MODE" ]; then
    echo "未設定要執行的環境(MODE)，請至docker/.env設定"
    exit 1
fi

npm install

case "$MODE" in
dev)
    echo "<<<開發模式>>>"
    npm run dev:ssl
    ;;
stag)
    echo "<<<測試模式>>>"
    npm run stag:ssl
    ;;
prod)
    echo "<<<正式模式>>>"
    npm run prod:ssl
    ;;
*)
    echo "模式錯誤"
    exit 1
    ;;
esac
