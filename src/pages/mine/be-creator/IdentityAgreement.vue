<template>
  <div class="w-full">
    <div class="flex flex-col space-y-20 text-base font-normal leading-lg">
      <div>您选择了使用护照来身份验证</div>
      <div class="text-gray-57">
        <ul class="flex list-inside list-decimal flex-col space-y-20">
          <li>
            我們將會需要您拍攝2張照片：
            <ul class="list-lower-alpha ml-35">
              <li>證件資訊正面照片</li>
              <li>用戶臉部與證件資訊正面照片</li>
            </ul>
          </li>
          <li>
            請確保拍攝過程中：
            <ul class="list-lower-alpha ml-35">
              <li>照片清晰可見</li>
              <li>在光線明亮的環境下進行拍攝</li>
              <li>不遮擋臉部，清晰的面部識別</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="text-gray-57">所有拍攝資料將嚴格保密，僅用於身份驗證之用</div>
      <div class="text-gray-57">以上說明了解後，點選下方開始即可開始拍照</div>
      <div class="text-gray-a3 text-center">
        <div>
          If something went wrong during this process you will be able to restart or continue verification from this
          page.
        </div>
        <div>
          You can also contact support by sending an email to
          <span class="text-black"><a href="mailto:support@vida.pub">support@vida.pub</a></span>
        </div>
      </div>
      <router-link :to="{ name: 'mine-creator-take-picture' }">
        <Button>開始拍照</Button>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import Button from '@comp/common/Button.vue'
</script>
