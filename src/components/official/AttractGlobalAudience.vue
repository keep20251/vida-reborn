<script setup></script>
<template>
  <div class="wrapper">
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
</template>
<style lang="scss" scoped>
.wrapper {
  @apply mt-80;
  .map {
    min-height: 341px;
    width: 100%;
    background-image: url(@/assets/images/official/golabel.png);
    background-position: left 25% top 50%;
    object-fit: cover;
    background-repeat: no-repeat;
  }
  .info {
    @apply m-10 mt-20 bg-white p-10;
    .title {
      @apply mt-10 text-right font-bold leading-10;
      font-size: 2.5em;
    }
    .context {
      @apply mt-30 leading-7;
    }
    .btns {
      @apply mt-50 flex justify-between;
      .btn {
        @apply flex w-1/3 flex-col items-center justify-center text-center;
        div:nth-child(1) {
          @apply w-fit rounded-full border-2 border-primary px-14 py-5;
        }

        div:nth-child(2) {
          @apply mt-4;
        }
      }
    }
  }
}
</style>
