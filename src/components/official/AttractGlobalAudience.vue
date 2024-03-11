<script setup></script>
<template>
  <div class="wrapper">
    <div class="wrapper-content">
      <div class="map"></div>
      <div class="info">
        <div class="title">{{ $t('official.attachment.title') }}</div>
        <div class="context">
          {{ $t('official.attachment.info') }}
        </div>
        <div class="btns">
          <div class="btn">
            <div>20+</div>
            <div>{{ $t('official.attachment.btns.country') }}</div>
          </div>
          <div class="btn">
            <div>5000+</div>
            <div>{{ $t('official.attachment.btns.creator') }}</div>
          </div>
          <div class="btn">
            <div>0%</div>
            <div>{{ $t('official.attachment.btns.charge') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  background: rgba(231, 242, 255, 0.3);

  .wrapper-content {
    @apply mx-auto my-80  h-screen sm:grid sm:h-fit sm:grid-cols-5 sm:bg-center sm:px-74;
    .map {
      @apply h-[40%] w-full bg-cover bg-left bg-no-repeat object-cover sm:col-span-3 sm:h-[400px] sm:bg-contain sm:bg-center;
      background-image: url(@/assets/images/official/golabel.png);
    }
    .info {
      @apply m-10 mt-20  flex flex-col justify-center p-10 sm:col-span-2 sm:max-w-xl sm:text-right;
      .title {
        @apply mt-10 text-right font-bold leading-10;
        font-size: 2.5em;
      }
      .context {
        @apply mt-20 leading-7;
      }
      .btns {
        @apply mt-40 flex  items-start justify-end space-x-17;
        .btn {
          @apply mr-2 flex  min-w-[6rem] flex-col  items-center justify-center  text-center;
          div:nth-child(1) {
            @apply min-w-[4rem] rounded-full border-2 border-primary px-14 py-1;
          }

          div:nth-child(2) {
            @apply mt-4;
          }
        }
        .btn:nth-child(3) {
          :first-child {
            @apply bg-primary text-white;
          }
        }
      }
    }
  }
}
</style>
