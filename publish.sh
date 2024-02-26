#!/bin/bash

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

function generateReport() {
    # 分支的前一個Tag
    tag=$(git describe --tags --abbrev=0)

    # 分支的前一個Tag到HEAD的log
    log=$(git log $tag..HEAD --format='%s' | grep -v "Merge")

    report=$(
        echo "----------VIDA SSR 部署----------"
        echo "Node版本: v16.19.0"
        echo "當前版本號: $version"
        echo "分支: $branch"
        echo "儲存庫: 172.105.200.120:rn/vida-reborn.git\n"
        echo "----------打包指令----------"
        echo "測試環境: npm install && npm run build:stag"
        echo "正式環境: npm install && npm run build\n"
        echo "----------執行指令----------"
        echo "測試環境：npm run stag [OPTIONS — —port={port}]"
        echo "正式環境：npm run prod [OPTIONS — —port={port}]"
        echo "範例: npm run stag — —port=2266\n"
        echo "----------快捷方式（包含打包&執行）----------"
        echo "測試環境：執行專案根目錄的 deploy-stag.sh"
        echo "正式環境：執行專案根目錄的 deploy-prod.sh\n"
        echo "----------迭代內容----------"
        echo "$log\n"
    )

    path="./reports/deploy-v$version-$branch.md"
    echo "$report" >$path
    echo "部署報告發布完成, PATH:$path"

}

# 棄用，因為要包裝的東西太多了，部署反而更麻煩
function package() {
    enviroment=$1
    dir=$2
    pack_dir="vida-v$version-$enviroment"

    if [ $? -eq 0 ]; then
        mkdir -p "./$pack_dir"
        cp -r ./server "./$pack_dir"
        cp -r ./$dir "./$pack_dir"
        cp ./package.json "./$pack_dir"
        # 壓縮dist目錄
        zip -r "$pack_dir.zip" "./$pack_dir"
        dest="/Users/$USER/Downloads/$pack_dir.zip"
        # 移動到下載目錄
        mv "$pack_dir.zip" $dest
        echo "打包成功: $dest"
        rm -rf "./$pack_dir"
    else
        echo "打包失敗"
    fi
}

function runProcedure() {
    env_file=$1
    branch=$2
    dir=$3

    changeEnvFile $env_file
    changePackageJson
    generateReport
}

function main() {
    # Check if jq is installed
    if ! command -v jq &>/dev/null; then
        echo "幫你裝一下這個工具需要的套件: jq"
        brew install jq
    fi

    echo "請輸入版本號:"
    read version

    if [ -z "$version" ]; then
        echo "版本號不能為空"
        exit 1
    fi

    echo "要部署哪個環境? (1: production, 2: stag)"
    env=1
    read choice

    if [ ! -z "$choice" ]; then
        env="$choice"
    fi

    if [ "$env" == "1" ]; then
        runProcedure ".env.production" "prod" "dist"
    else
        runProcedure ".env.staging" "stag" "dist-staging"
    fi
}

main
