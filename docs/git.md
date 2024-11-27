# Git 規範

## Git Commit 命名原則

1. 請以 `新增＃` `修正＃` `更新＃` `刪除＃` `重構＃` `部署＃` 開頭，後面接上該 `commit` 的簡短敘述說明。例如新增一個用戶註冊的功能，則該 `commit` 應為`新增＃用戶註冊功能`
2. 若該 `commit` 包含 `Monday` 上的 `issue`，則後面需補上該 `issue` 的編號，且須貼上該 `issue` 的簡短敘述說明。例如 `bug list` 上序號 `#1`，問題為`用戶無法註冊...`，則該 `commit` 應為`修正＃bug issue#1 用戶無法註冊`
3. 盡可能避免多個功能在同一個 `commit` 中，請分別 `commit`
4. 禁止在 `master` 中直接修改 `commit`，應在自己的分支上修改後再合併到 `master`，建議使用 `rebase` 的方式合併

## Gitlab Flow 分支開發原則

1. <font color="red">避免直接推送到 `main/master, prod, stag` 分支，盡可能保持只有合併操作</font>
2. 無論是開發新功能或是修正錯誤，甚至是 `Hotfix` ，都應該從 `master` 另開一個特性分支`(feature)`
3. 命名規則：主旨＋負責人名稱＋日期＋功能。例如：對活動彈窗崩潰的熱修復可以命名為`hotfix/popup-ad-dialog-crash`
4. 開發完畢後，務必先使用 `git rebase main/master` 對主要分支進行更新與解衝突
5. 使用 `git push -u origin {branchName}` 將分支推送到遠端
6. 由主要發版的人員進行分支合併，挑選需要被釋出的功能進行合併，使用 `git merge {branchname} --no-ff`
