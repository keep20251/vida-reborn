<script setup></script>
<template>
  <div class="wrapper">
    <div class="wrapper-content">
      <div class="map"></div>
      <div class="info">
        <div class="title">Attract a Global Audience</div>
        <div class="context">
          With active users from all over the globe, Vida enables creators to reach and attract a global audience. Forge
          stronger connections with your fan base and foster a profound sense of community.
        </div>
        <div class="btns">
          <div class="btn">
            <div>20+</div>
            <div>Countries</div>
          </div>
          <div class="btn">
            <div>5000+</div>
            <div>Creators</div>
          </div>
          <div class="btn">
            <div>0%</div>
            <div>Service charge</div>
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
    @apply mx-auto my-80  sm:grid sm:grid-cols-5 sm:px-74;
    .map {
      @apply w-full sm:col-span-3 sm:h-[400px] sm:bg-contain sm:bg-center;
      min-height: 341px;
      background-image: url(@/assets/images/official/golabel.png);
      background-position: left 25% top 50%;
      object-fit: cover;
      background-repeat: no-repeat;
    }
    .info {
      @apply m-10 mt-20  p-10 sm:col-span-2 sm:ml-auto sm:max-w-xl sm:text-right;
      .title {
        @apply mt-10 text-right font-bold leading-10;
        font-size: 2.5em;
      }
      .context {
        @apply mt-30 leading-7;
      }
      .btns {
        @apply mt-50 flex  items-start justify-end space-x-17;
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
