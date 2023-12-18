<template>
  <Page>
    <template #main-top>
      <div class="flex w-full px-20">
        <div class="flex cursor-pointer"><Icon name="back" :size="24"></Icon> <span>Back</span></div>
      </div>
    </template>
    <template #default>
      <div class="px-20">
        <div
          class="relative mb-35 flex h-[400px] w-full bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${profileBg})` }"
        >
          <div class="absolute bottom-[-35px] flex h-70 w-full items-end justify-between px-20">
            <div
              class="h-70 w-70 rounded-full bg-cover bg-center bg-no-repeat"
              :style="{ backgroundImage: `url(${profileAvatar})` }"
            ></div>
            <div class="flex items-center gap-x-15">
              <Icon class="cursor-pointer" name="sharePage" :size="20"></Icon>
              <Icon class="cursor-pointer" name="moreHorizontal" :size="20"></Icon>
              <button
                class="bg-gray03 rounded-full border-[1.5px] border-gray66 px-20 py-6 text-[0.875rem] font-normal leading-[0.875rem]"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div class="grid gap-y-10 pt-10">
          <div class="flex items-end gap-x-5">
            <div class="text-[1.125rem] font-bold leading-[1.125rem]">Angelababy</div>
            <div class="text-[0.75rem] font-normal leading-[0.75rem] text-gray66">＠angelababy</div>
          </div>
          <div class="flex items-end gap-x-5">
            <div class="text-[0.75rem] font-normal leading-[0.75rem]">My Links:</div>
            <div class="text-[0.75rem] font-normal leading-[0.75rem] text-gray66">WenHsin.com</div>
            <div class="text-[0.75rem] font-normal leading-[0.75rem] text-gray66">•</div>
            <div class="text-[0.75rem] font-normal leading-[0.75rem] text-gray66">143.2k viewed</div>
          </div>
          <p class="text-[0.875rem] font-normal leading-[1.125rem]">
            🇩🇪/🇺🇸 - 19 years😇 check my link to get to know me &lt; 3, I'm convinced your massive dick will help me get
            to the spread, daddy💦💦
          </p>
        </div>
        <div class="my-20 flex gap-x-12">
          <Button>View subscription plans</Button>
        </div>
        <div class="bg-gray03 flex h-36 w-full items-center px-20 text-[0.875rem] font-bold leading-[0.875rem]">
          All Posts 85
        </div>
        <div class="overflow-x-hidden">
          <List :items="items" item-key="id">
            <template #default="{ last }">
              <Feed class="py-20"></Feed>
              <div v-if="!last" class="h-1 bg-black opacity-[0.15]"></div>
            </template>
            <template #bottom>
              <div class="flex items-center justify-center py-8 text-gray36"><Loading></Loading>/沒有更多了</div>
            </template>
          </List>
        </div>
        <div>
          <div>
            <img src="" alt="" />
          </div>
        </div>
      </div>
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
import List from '@comp/common/List.vue'
import Feed from '@comp/main/Feed.vue'
import Button from '@comp/common/Button.vue'

const items = ref([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

const inputValue = ref('')

const cats = ref([
  { img: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg' },
  { img: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg' },
  { img: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg' },
  { img: 'https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg' },
  { img: 'https://images.pexels.com/photos/1440403/pexels-photo-1440403.jpeg' },
])

const profileBg = ref('https://images.pexels.com/photos/1818608/pexels-photo-1818608.jpeg')
const profileAvatar = ref('https://images.pexels.com/photos/129753/pexels-photo-129753.jpeg')
</script>
