<template>
  <!-- 完整的创作者帖子组件，组合了所有子组件 -->
  <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 创作者信息 -->
    <CreatorAvatar 
      :avatar-url="postData.avatarUrl"
      :username="postData.username"
      :time-ago="postData.timeAgo"
    />
    
    <!-- 媒体内容 -->
    <MediaContent 
      :is-image="postData.isImage"
      :media-url="postData.mediaUrl"
      :media-alt="postData.mediaAlt"
      :poster-url="postData.posterUrl"
      :meta-info="postData.metaInfo"
    />
    
    <!-- 互动数据 -->
    <InteractionStats 
      :likes="postData.likes"
      :comments="postData.comments"
      :reposts="postData.reposts"
      :views="postData.views"
    />
    
    <!-- 内容描述 -->
    <ContentDescription 
      :greeting="postData.greeting"
      :tags="postData.tags"
      :description="postData.description"
    />
  </div>
</template>

<script setup>
import CreatorAvatar from './CreatorAvatar.vue';
import MediaContent from './MediaContent.vue';
import InteractionStats from './InteractionStats.vue';
import ContentDescription from './ContentDescription.vue';

// 定义帖子数据属性
defineProps({
  postData: {
    type: Object,
    required: true,
    description: "帖子完整数据对象"
  }
});
</script>
