<template>
  <!-- 媒体内容展示组件：支持图片或视频 -->
  <div class="relative mb-2 overflow-hidden rounded-lg bg-gray-100">
    <!-- 图片内容 -->
    <img v-if="isImage" :src="mediaUrl" :alt="mediaAlt" class="h-64 w-full object-cover" />

    <!-- 视频内容 -->
    <video v-else :src="mediaUrl" :poster="posterUrl" class="h-64 w-full object-cover" controls></video>

    <!-- 解锁内容按钮 -->
    <button
      class="hover:shadow-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-600 px-6 py-2 font-medium text-white shadow-lg transition-all hover:bg-indigo-700"
    >
      解鎖內容
    </button>

    <!-- 媒体元数据（时长/数量） -->
    <div class="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
      {{ metaInfo }}
    </div>
  </div>
</template>

<script setup>
// 定义媒体内容相关属性
defineProps({
  isImage: {
    type: Boolean,
    required: true,
    description: '是否为图片内容，true为图片，false为视频',
  },
  mediaUrl: {
    type: String,
    required: true,
    description: '媒体资源URL（图片或视频）',
  },
  mediaAlt: {
    type: String,
    default: '媒体内容',
    description: '媒体内容的alt文本',
  },
  posterUrl: {
    type: String,
    default: '',
    description: '视频的封面图URL',
  },
  metaInfo: {
    type: String,
    required: true,
    description: "媒体元数据，如视频时长'09:01'或图片数量'2/9'",
  },
})
</script>
