<template>
  <!-- 内容描述组件：展示文本内容和标签 -->
  <div class="text-sm text-gray-800">
    <!-- 问候语 -->
    <p class="mb-1">{{ greeting }}</p>
    <p class="mb-1">
      <span v-for="tag in tags" :key="tag" class="mr-2 text-indigo-600">#{{ tag }}</span>
    </p>

    <!-- 详细描述 -->
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
// 定义内容描述相关属性
defineProps({
  greeting: {
    type: String,
    required: true,
    description: '问候语内容',
  },
  tags: {
    type: Array,
    required: true,
    description: "标签数组，如['黑丝', '写真']",
  },
  description: {
    type: String,
    required: true,
    description: '详细描述文本',
  },
})
</script>
