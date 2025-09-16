<template>
  <!-- 互动数据统计组件：展示点赞、评论等数据 -->
  <div class="mb-2 flex items-center text-sm text-gray-500">
    <div class="mr-4 flex items-center">
      <i class="fa fa-heart mr-1 text-red-500"></i>
      <span>{{ likes }}</span>
    </div>
    <div class="mr-4 flex items-center">
      <i class="fa fa-comment mr-1 text-blue-500"></i>
      <span>{{ comments }}</span>
    </div>
    <div class="mr-4 flex items-center">
      <i class="fa fa-retweet mr-1 text-green-500"></i>
      <span>{{ reposts }}</span>
    </div>
    <div class="flex items-center">
      <i class="fa fa-eye mr-1 text-purple-500"></i>
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
    description: '点赞数量',
  },
  comments: {
    type: Number,
    required: true,
    description: '评论数量',
  },
  reposts: {
    type: Number,
    required: true,
    description: '转发数量',
  },
  views: {
    type: Number,
    required: true,
    description: '浏览数量',
  },
})
</script>
