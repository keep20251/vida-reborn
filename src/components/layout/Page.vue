<template>
  <div
    class="flex grow basis-full flex-row justify-start overflow-auto sm:basis-[600px] md:basis-[900px] xl:basis-[950px]"
  >
    <div class="w-full max-w-[600px] md:w-[600px]">
      <main>
        <div v-if="$slots['main-top']" class="sticky top-0 h-52 w-full max-w-[600px] bg-slate-500/50 md:w-[600px]">
          <slot name="main-top"></slot>
        </div>
        <div>
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="hidden md:block md:w-[300px] xl:w-[350px]">
      <aside>
        <div v-if="$slots['aside-top']" class="fixed top-0 h-52 bg-red-300/50 md:w-[300px] xl:w-[350px]">
          <slot name="aside-top"></slot>
        </div>
        <div :class="{ 'pt-52': $slots['aside-top'] }">
          <slot name="aside"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup></script>
