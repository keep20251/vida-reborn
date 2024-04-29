<script setup></script>

<template>
  <div class="official-joinus">
    <!-- 輪播 creator -->
    <div
      class="official-joinus-creator"
      :class="{ 'transition-transform': transitionOn }"
      :style="{ transform: `translateX(${translateXArray[0]})` }"
      @transitionend="onTransitionEnd"
    >
      <div class="official-joinus-creator-bg"></div>
      <div class="official-joinus-creator-info">
        <div class="official-joinus-creator-info-container">
          <h1>{{ $t('official.joinUsAsCreator.title') }}</h1>
          <h2>{{ $t('official.joinUsAsCreator.subtitle') }}</h2>
          <div class="info">
            {{ $t('official.joinUsAsCreator.info') }}
          </div>
          <a :href="`/${locale}/mine/creator`" class="btn">{{ $t('official.joinUs.btn') }}</a>
        </div>
      </div>
    </div>

    <!-- 輪播 subscriber -->
    <div
      class="official-joinus-subscriber"
      :class="{ 'transition-transform': transitionOn }"
      :style="{ transform: `translateX(${translateXArray[1]})` }"
      @transitionend="onTransitionEnd"
    >
      <div class="official-joinus-subscriber-bg"></div>
      <div class="official-joinus-subscriber-info">
        <div class="official-joinus-subscriber-info-container">
          <h1>{{ $t('official.joinUsAsSubscriber.title') }}</h1>
          <h2>{{ $t('official.joinUsAsSubscriber.subtitle') }}</h2>
          <div class="info">
            {{ $t('official.joinUsAsSubscriber.info') }}
          </div>
          <a :href="`/${locale}/mine/creator`" class="btn">{{ $t('official.joinUs.btn') }}</a>
        </div>
      </div>
    </div>

    <!-- 輪播指標 -->
    <div class="absolute bottom-36 left-1/2 flex -translate-x-1/2 space-x-8">
      <div
        v-for="(v, i) in translateXArray"
        :key="i"
        class="h-8 w-36 cursor-pointer rounded-full bg-white"
        :class="{ 'opacity-30': v !== '0%' }"
        @click="next(i)"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { useLocale } from '@use/utils/locale'

const locale = useLocale()

const transitionOn = ref(false)
const translateXArray = ref(['0%', '100%'])
let translateXIndex = 0

let timerId
function next(forceIndex) {
  clearTimeout(timerId)
  transitionOn.value = true
  translateXIndex =
    typeof forceIndex !== 'undefined' ? forceIndex : (translateXIndex + 1) % translateXArray.value.length
  translateXArray.value = translateXArray.value.map((v, i) =>
    i === translateXIndex ? '0%' : v === '0%' ? '-100%' : '100%',
  )
  setNext()
}
function setNext() {
  timerId = setTimeout(next, 8000)
}
function onTransitionEnd() {
  transitionOn.value = false
  translateXArray.value = translateXArray.value.map((v, i) => (v === '-100%' ? '100%' : v))
}
onActivated(() => setNext())
onDeactivated(() => clearTimeout(timerId))
</script>

<style lang="scss" scoped>
.official-joinus {
  @apply relative z-auto mx-auto h-screen w-full overflow-hidden;

  &-creator,
  &-subscriber {
    @apply absolute h-full w-full;

    &-bg {
      @apply absolute inset-0;
      max-width: 100%;
      height: 100%;
      background-position: center;
      object-fit: cover;
      background-repeat: no-repeat;
    }
    &-info {
      @apply absolute flex flex-col items-end text-white;
      &-container {
        font-size: 1.5rem;
        @apply flex flex-col px-20 sm:max-w-md;

        h1 {
          @apply font-bold;
          font-size: 2.5rem;
        }
        h2 {
          font-size: 1.563rem;
        }
        .info {
          @apply mt-30;
          font-size: 1rem;
          line-height: 1.5;
        }
        .btn {
          @apply ml-auto mt-20 cursor-pointer rounded-full  bg-primary px-20 py-10 text-lg font-bold text-white sm:ml-0;
          width: fit-content;
        }
      }
    }
  }

  &-creator {
    &-bg {
      background-image: url(@/assets/images/official/join-us-creator.png);
    }
    &-info {
      @apply bottom-84 right-0 md:bottom-auto md:right-[12%] md:top-1/2 md:-translate-y-1/2;
    }
  }

  &-subscriber {
    &-bg {
      background-image: url(@/assets/images/official/join-us-subscriber.png);
    }
    &-info {
      @apply left-0 top-64 md:left-[11%] md:top-1/2 md:-translate-y-1/2;
    }
  }
}
</style>
