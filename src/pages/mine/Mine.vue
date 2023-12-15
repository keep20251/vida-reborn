<template>
  <Page>
    <template #default>
      <div>Mine</div>
    </template>
    <template #aside>
      <div class="m-15 grid gap-y-20">
        <InputWrap
          v-model="inputValue"
          :placeholder="'搜索...'"
          :appendIcon="'search'"
          @click:append="console.log('appendIcon')"
        ></InputWrap>
        <SetList />
        <div class="grid gap-y-5">
          <span>VIDA 活動與廣告</span>
          <Carousel :items="cats" :intervalTime="true"></Carousel>
          <p class="text-[0.75rem] font-normal leading-[0.75rem] text-gray-400">
            Terms of Service Privacy Policy Cookie Policy Ad info About @ 2023 ViDA corp
          </p>
        </div>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import SetList from '@comp/mine/SetList.vue'
import Carousel from '@comp/common/Carousel.vue'

const inputValue = ref('')

const cats = ref([
  {
    img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg',
  },
  {
    img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg',
  },
  {
    img: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg',
  },
  {
    img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg',
  },
  {
    img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg',
  },
])
</script>
