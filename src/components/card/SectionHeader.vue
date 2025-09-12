<template>
  <!-- 通用的区块标题组件，接收标题文字作为参数 -->
  <div class="flex justify-between items-center px-4 py-3 bg-white border-b">
    <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
    <button class="text-gray-500 hover:text-gray-700 transition-colors">
      更多 <i class="fa fa-angle-right ml-1"></i>
    </button>
  </div>
</template>

<script setup>
// 定义标题属性，必传
defineProps({
  title: {
    type: String,
    required: true,
    description: "区块的标题文字"
  }
});
</script>
