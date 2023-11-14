#!/bin/bash

function packProcedure() {
    echo "Pack folder:$1, enviroment:$2"
    if [ $? -eq 0 ]; then
        # 壓縮dist目錄
        echo "輸出資料夾: $1"
        zip -r "fantasi-ver$version.zip" $1
        dest="/Users/$USER/Downloads/fantasi-v$version-$2.zip"
        # 移動到下載目錄
        mv "fantasi-ver$version.zip" $dest
        echo "打包成功: $dest"
    else
        echo "打包失敗"
    fi
}

function changeEnvFile() {
    if [ -f "$1" ]; then
        sed -i '' "s/VITE_APP_VERSION=.*/VITE_APP_VERSION=$version/" $1
        echo "更新檔案: $1"
    else
        echo "$1 檔案不存在，程序中止"
        exit 1
    fi
}

function changePackageJson() {
    # 更新 package.json 的版本號
    jq '.version = "'$version'"' package.json >temp.json && mv temp.json package.json
    echo "更新檔案: package.json"
}

# Check if Homebrew is installed
if ! command -v brew &>/dev/null; then
    echo "你沒有安裝Homebrew喔，先下載一下吧 https://brew.sh/"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &>/dev/null; then
    echo "幫你裝一下這個工具需要的套件: jq"
    brew install jq
fi

if ! command -v zip &>/dev/null; then
    echo "幫你裝一下這個工具需要的套件: zip"
    brew install zip
fi

echo "請輸入版本號:"
read version

if [ -z "$version" ]; then
    echo "版本號不能為空"
    exit 1
fi

echo "要打包哪個環境? (1: production, 2: staging, 3: all)"
env=1
read choice

if [ ! -z "$choice" ]; then
    env="$choice"
fi
echo "開始打包"

changePackageJson

if [ "$env" == "1" ]; then
    changeEnvFile ".env.production"
    npm run build
    packProcedure "dist" "production"

elif [ "$env" == "2" ]; then
    changeEnvFile ".env.staging"
    npm run build:staging
    packProcedure "dist-staging" "staging"

else
    changeEnvFile ".env.production"
    npm run build
    packProcedure "dist" "production"

    changeEnvFile ".env.staging"
    npm run build:staging
    packProcedure "dist-staging" "staging"
fi
