<template>
  <div class="mb-2 flex items-center">
    <img :src="avatarUrl" :alt="username" class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />
    <span class="ml-3 font-medium text-gray-800">{{ username }}</span>
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
