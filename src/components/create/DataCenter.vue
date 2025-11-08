<template>
  <div class="data-center">
    <div class="data-center-container">
      <div class="data-center-content">
        <div class="title">投稿数据概览</div>
        <div class="video-data-list">
          <div class="video-data-item">
            <div class="data-title">投稿量</div>
            <div class="count">{{ userVideoData.videoCount }}</div>
          </div>
          <div class="video-data-item">
            <div class="data-title">播放量总数</div>
            <div class="count">{{ userVideoData.playCount }}</div>
          </div>
          <div class="video-data-item">
            <div class="data-title">点赞数</div>
            <div class="count">{{ userVideoData.likeCount }}</div>
          </div>
          <div class="video-data-item">
            <div class="data-title">收藏数</div>
            <div class="count">{{ userVideoData.favoriteCount }}</div>
          </div>
          <div class="video-data-item">
            <div class="data-title">评论数</div>
            <div class="count">{{ userVideoData.commentCount }}</div>
          </div>
          <div class="video-data-item">
            <div class="data-title">分享数</div>
            <div class="count">{{ userVideoData.shareCount }}</div>
          </div>
        </div>
        <!-- <div class="title">投稿表现</div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserVideoDataAPI } from '@/api/video'
import { onMounted, reactive } from 'vue'

const userVideoData = reactive({
  videoCount: 0,
  playCount: 0,
  likeCount: 0,
  favoriteCount: 0,
  commentCount: 0,
  shareCount: 0
})

onMounted(async () => {
  const res = await getUserVideoDataAPI()
  userVideoData.videoCount = res.data.data.videoCount
  userVideoData.playCount = res.data.data.playCount
  userVideoData.likeCount = res.data.data.likeCount
  userVideoData.favoriteCount = res.data.data.favoriteCount
  userVideoData.commentCount = res.data.data.commentCount
  userVideoData.shareCount = res.data.data.shareCount
})
</script>

<style scoped>
.data-center {
  height: 100%;
  width: 100%;

  .data-center-container {
    margin: 0px 70px;
    height: 100%;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;

    .data-center-content {
      background-color: var(--xz-card-bg);
      height: 100%;
      width: 100%;
      overflow: auto;
      padding: 20px 40px 20px 40px;

      .title {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 20px;
      }

      .video-data-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
        margin-bottom: 20px;

        .video-data-item {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          background-color: var(--xz-secondbg);

          .data-title {
            color: var(--xz-secondtext);
          }

          .count {
            font-size: 1.2rem;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
