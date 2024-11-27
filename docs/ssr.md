# SSR 渲染機制

## 關於頁面需不需要 SSR 的 Page 應用

目前設想需要 SSR 的有:

1. 主頁 /:lang/home
2. 搜尋頁 /:lang/search
3. 創作者頁 /:lang/:username
4. 帖子頁 /:lang/:username/:feedid

其他頁面感覺都不需要，再加上 Page 中的 aside 應該是也不需要。

所以 Page 可能大概會長成⬇

```html
<!-- 使用方式 -->
<Page>
  <template #main-top> </template>
  <template #default>
    <!-- /:lang/home | /:lang/search | /:lang/:username | /:lang/:username/:feedid -->
    <CustomComponent></CustomComponent>

    <!-- 其他頁 -->
    <ClientOnly>
      <CustomComponent></CustomComponent>
    </ClientOnly>
  </template>
  <template #aside-top>
    <ClientOnly>
      <CustomComponent></CustomComponent>
    </ClientOnly>
  </template>
  <template #aside>
    <ClientOnly>
      <CustomComponent></CustomComponent>
    </ClientOnly>
  </template>
</Page>
```