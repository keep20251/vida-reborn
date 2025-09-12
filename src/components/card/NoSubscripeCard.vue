<template>
  <div class="px-6 py-2">
    <p class="flex items-center text-xl font-semibold">👋 歡迎！</p>
    <p class="mt-2 text-gray-600">立即前往第一個創作者的頻道吧</p>
  </div>
  <div class="px-6 py-2">
    <div class="shadow rounded-lg bg-white p-6">
      <h3 class="mb-4 text-center font-medium">前往創作者頻道</h3>
      <div class="mb-4 flex items-center">
        <label for="creatorId" class="mr-2">創作者 @ID 號碼</label>
        <button class="ml-auto text-indigo-500">掃碼</button>
      </div>
      <input type="text" id="creatorId" placeholder="輸入創作者的 @ID 號碼" class="mb-4 w-full rounded border p-2" />
      <button class="w-full rounded bg-indigo-500 p-2 text-white">立即前往</button>
    </div>
  </div>
   <div class="px-6 py-4 text-center">
    <p class="text-gray-500">我是創作者</p>
  </div>
</template>
