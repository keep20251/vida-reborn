<template>
  <!-- 互动数据统计组件：展示点赞、评论等数据 -->
  <div class="flex items-center text-gray-500 text-sm mb-2">
    <div class="flex items-center mr-4">
      <i class="fa fa-heart text-red-500 mr-1"></i>
      <span>{{ likes }}</span>
    </div>
    <div class="flex items-center mr-4">
      <i class="fa fa-comment text-blue-500 mr-1"></i>
      <span>{{ comments }}</span>
    </div>
    <div class="flex items-center mr-4">
      <i class="fa fa-retweet text-green-500 mr-1"></i>
      <span>{{ reposts }}</span>
    </div>
    <div class="flex items-center">
      <i class="fa fa-eye text-purple-500 mr-1"></i>
      <span>{{ views }}</span>
    </div>
  </div>
</template>

<script setup>
// 定义互动数据相关属性
defineProps({
  likes: {
    type: Number,
    required: true,
    description: "点赞数量"
  },
  comments: {
    type: Number,
    required: true,
    description: "评论数量"
  },
  reposts: {
    type: Number,
    required: true,
    description: "转发数量"
  },
  views: {
    type: Number,
    required: true,
    description: "浏览数量"
  }
});
</script>
