<template>
  <div class="flex w-full flex-col space-y-10">
    <!-- head -->
    <div class="flex h-30 w-full items-center">
      <div class="mr-5 h-30 w-30 rounded-full bg-lime-700"></div>
      <div class="grow text-sm font-bold leading-none">Angelababy</div>
      <div class="grow text-right text-xs font-medium leading-5 text-gray66">6 minutes</div>
      <Icon name="moreVertical" :size="20"></Icon>
    </div>

    <!-- media -->
    <div>
      <div class="w-full rounded-[0.625rem] bg-orange-100">
        <div class="pt-[64%]"></div>
      </div>
    </div>

    <!-- feature -->
    <div class="flex h-20 space-x-20">
      <div class="flex grow space-x-10">
        <Icon name="likeOutline" :size="20"></Icon>
        <div class="text-xs font-medium leading-5">113</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="comment" :size="20"></Icon>
        <div class="text-xs font-medium leading-5">289</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="sharePost" :size="20"></Icon>
        <div class="text-xs font-medium leading-5">94</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="play" :size="20"></Icon>
        <div class="text-xs font-medium leading-5">23,000</div>
      </div>
      <div class="flex grow space-x-10">
        <Icon name="starOutline" :size="20"></Icon>
        <div class="text-xs font-medium leading-5">94</div>
      </div>
    </div>

    <!-- content -->
    <div class="flex flex-col space-y-5">
      <div class="text-sm font-bold leading-none">Hello, New Followers!</div>
      <div class="flex items-end space-x-5">
        <div>
          <div class="flex space-x-5">
            <div class="text-sm leading-[1.125rem] text-[#6567E8]">#黑丝</div>
            <div class="text-sm leading-[1.125rem] text-[#6567E8]">#写真</div>
          </div>
          <div class="text-sm leading-[1.125rem]">
            Thank you so much for joining my Fansly! ❤️ Throw back ❤️ DM me! Hello everyone, this is...
          </div>
        </div>
        <div class="text-sm leading-[1.125rem] text-gray66">more</div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
