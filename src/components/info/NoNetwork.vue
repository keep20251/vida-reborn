<template>
  <div class="flex flex-col items-center justify-center">
    <!-- <img class="h-30 w-54 xl:h-40 xl:w-72" src="@/assets/logo.svg?url" alt="VIDA" /> -->
    <div class="flex w-full grow flex-col items-center justify-center space-y-36">
      <img class="w-[90%]" src="@/assets/images/no-network.svg?url" alt="Error" />
      <span class="text-lg font-medium">{{ $t('content.noNetwork') }}</span>
    </div>
  </div>
</template>
