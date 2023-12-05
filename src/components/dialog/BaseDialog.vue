<template>
  <teleport to="#main">
    <div class="absolute h-full w-full bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>
