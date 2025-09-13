<template>
  <!-- 创作者信息组件：包含头像、名称和时间 -->
  <div class="mb-2 flex items-center">
    <!-- 创作者头像 -->
    <img :src="avatarUrl" :alt="username" class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />

    <!-- 创作者名称 -->
    <span class="ml-3 font-medium text-gray-800">{{ username }}</span>

    <!-- 发布时间 -->
    <span class="ml-auto text-sm text-gray-500">{{ timeAgo }}</span>
  </div>
</template>

<script setup>
// 定义创作者信息相关属性
defineProps({
  avatarUrl: {
    type: String,
    required: true,
    description: '创作者头像图片URL',
  },
  username: {
    type: String,
    required: true,
    description: '创作者用户名',
  },
  timeAgo: {
    type: String,
    required: true,
    description: "内容发布时间，如'刚刚'、'35分钟前'",
  },
})
</script>
