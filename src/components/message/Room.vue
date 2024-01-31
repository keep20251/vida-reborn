<template>
  <div class="flex h-full flex-col space-y-10">
    <div class="flex items-center justify-center space-x-10">
      <div class="flex cursor-pointer">
        <Icon name="back" size="20"></Icon>
      </div>
      <div class="h-40 w-40 shrink-0 rounded-full bg-orange-200"></div>
      <div class="flex-grow text-base font-bold">Tommy</div>
      <div class="flex cursor-pointer">
        <Icon name="moreHorizontal" size="20"></Icon>
      </div>
    </div>
    <div class="h-1 bg-gray-e5"></div>
    <div class="scrollbar-md flex w-[calc(100%+30px)] grow flex-col space-y-15 overflow-auto">
      <!-- 對方 -->
      <div
        v-for="(_, i) in 3"
        :key="i"
        class="relative mr-24 flex max-w-[80%] space-x-8 self-start rounded-3xl bg-gray-f6 px-16 py-10 text-base leading-lg text-black before:absolute before:bottom-0 before:left-0 before:h-16 before:rounded-br-lg before:border-l-[1rem] before:border-solid before:border-l-gray-f6 after:absolute after:-left-8 after:bottom-0 after:h-16 after:w-10 after:rounded-br-md after:bg-white md:max-w-[65%]"
      >
        <p class="grow whitespace-pre-wrap text-justify" :style="{ 'word-break': 'break-word' }">
          {{
            `The align-self CSS property overrides a grid or flex item's align-items value.
            
In Grid, it aligns the item inside the grid area. In Flexbox, it aligns the item on the cross axis.`
          }}
        </p>
        <div class="shrink-0 self-end text-sm text-gray-a3">12:05</div>
      </div>

      <!-- 自己 -->
      <div
        v-for="(_, i) in 6"
        :key="i"
        class="relative mr-24 flex max-w-[80%] space-x-8 self-end rounded-3xl bg-primary px-16 py-10 text-base leading-lg text-white before:absolute before:bottom-0 before:right-0 before:h-16 before:rounded-bl-lg before:border-r-[1rem] before:border-solid before:border-r-primary after:absolute after:-right-8 after:bottom-0 after:h-16 after:w-10 after:rounded-bl-md after:bg-white md:max-w-[65%]"
      >
        <p class="grow whitespace-pre-wrap text-justify" :style="{ 'word-break': 'break-word' }">
          {{
            `在 HTTP 协议中，重定向操作由服务器向请求发送特殊的重定向响应而触发。重定向响应包含以 3 开头的状态码，以及 Location 标头，其保存着重定向的 URL。

浏览器在接收到重定向时，它们会立刻加载 Location 标头中提供的新 URL。除了额外的往返操作中会有一小部分性能损失之外，重定向操作对于用户来说是不可见的。`
          }}
        </p>
        <div class="shrink-0 self-end text-sm text-white">12:05</div>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-10">
      <div class="flex cursor-pointer">
        <Icon name="attach" size="20"></Icon>
      </div>
      <InputWrap v-model="input" class="grow" :appendIconBtn="'sendWhite'"></InputWrap>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'

const input = ref('')
</script>
