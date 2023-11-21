<template>
  <div
    class="flex flex-row justify-start grow basis-full sm:basis-[600px] md:basis-[900px] xl:basis-[950px] overflow-auto"
  >
    <div class="w-full max-w-[600px] md:w-[600px]">
      <main>
        <div v-if="$slots['main-top']" class="w-full max-w-[600px] md:w-[600px] h-52 sticky top-0 bg-slate-500/50">
          <slot name="main-top"></slot>
        </div>
        <div>
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="hidden md:block md:w-[300px] xl:w-[350px]">
      <aside>
        <div v-if="$slots['aside-top']" class="md:w-[300px] xl:w-[350px] h-52 fixed top-0 bg-red-300/50">
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
