<template>
  <teleport to="#main">
    <div class="absolute h-full w-full bg-black bg-opacity-50">
      <div class="flex h-full items-center justify-center">
        <div class="m-100 mx-20 w-full max-w-lg rounded-xl bg-white">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
