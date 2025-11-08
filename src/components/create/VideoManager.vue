<template>
  <div class="video-manager">
    <div class="video-manager-container">
      <div class="video-manager-content">
        <div class="manager-nav">
          <span
            @click="handleGetAllVideoList"
            class="manager-nav-item"
            :class="{ active: currentTag === 'all' }"
            >全部作品</span
          >
          <span
            @click="handleGetPassVideoList"
            class="manager-nav-item"
            :class="{ active: currentTag === 'pass' }"
            >已通过</span
          >
          <span
            @click="handleGetNotPassVideoList"
            class="manager-nav-item"
            :class="{ active: currentTag === 'notPass' }"
            >未通过</span
          >
        </div>
        <div class="video-list">
          <div class="video-item" v-for="video in showVideoList" :key="video.id">
            <div class="video-cover">
              <img :src="video.coverUrl" alt="" />
            </div>
            <div class="video-info">
              <div class="title">{{ video.title }}</div>
              <div class="time">{{ video.createdTime }}</div>
              <div class="detail">
                <div class="info">
                  <span class="text">播放</span>
                  <span class="count">{{ video.playCount }}</span>
                </div>
                <div class="info">
                  <span class="text">点赞</span>
                  <span class="count">{{ video.likeCount }}</span>
                </div>
                <div class="info">
                  <span class="text">收藏</span>
                  <span class="count">{{ video.shareCount }}</span>
                </div>
                <div class="info">
                  <span class="text">分享</span>
                  <span class="count">{{ video.shareCount }}</span>
                </div>
              </div>
            </div>
            <div class="video-action">
              <div @click="handleEditVideo(video.id)" class="btn primary">编辑作品</div>
              <el-popconfirm
                @confirm="handleDeleteVideo(video.id)"
                class="box-item"
                title="确定删除作品吗"
                placement="top-start"
              >
                <template #reference>
                  <div class="btn danger">删除作品</div>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteVideoByIdAPI, getUserVideoListAPI } from '@/api/video'
import type { VideoVO } from '@/type'
import { message } from '@/utils'
import { onMounted, ref } from 'vue'

const videoList = ref<VideoVO[]>([])

const showVideoList = ref<VideoVO[]>([])

const currentTag = ref('all')

const handleGetPassVideoList = () => {
  currentTag.value = 'pass'
  showVideoList.value = videoList.value.filter((item: VideoVO) => {
    return item.status === 2
  })
}

const handleGetAllVideoList = () => {
  showVideoList.value = videoList.value
  currentTag.value = 'all'
}

const handleGetNotPassVideoList = () => {
  currentTag.value = 'notPass'
  showVideoList.value = videoList.value.filter((item: VideoVO) => {
    return item.status !== 2
  })
}

const handleDeleteVideo = async (id: number) => {
  const res = await deleteVideoByIdAPI(id)
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: '删除成功'
    })
    showVideoList.value = showVideoList.value.filter((item: VideoVO) => {
      return item.id !== id
    })
  }
}

const handleEditVideo = (videoId: number) => {
  console.log(videoId)
}

onMounted(async () => {
  const res = await getUserVideoListAPI()
  videoList.value = res.data.data
  showVideoList.value = videoList.value
})
</script>

<style scoped>
.video-manager {
  height: 100%;
  width: 100%;

  .video-manager-container {
    margin: 0px 70px;
    height: 100%;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;

    .video-manager-content {
      background-color: var(--xz-card-bg);
      height: 100%;
      width: 100%;
      overflow: auto;

      .manager-nav {
        height: 64px;
        border-bottom: 1px solid #e7e7e7;

        .manager-nav-item {
          line-height: 64px;
          padding-bottom: 18px;
          padding-top: 26px;
          margin-left: 40px;
          font-size: 16px;
          height: 100%;
          color: #505050;
          cursor: pointer;

          &.active {
            color: #00a1d6;
            font-weight: 700;
            border-bottom: 3px solid #00a1d6;
          }
        }
      }

      .video-list {
        display: flex;
        flex-direction: column;
        padding: 20px 40px 20px 40px;
        overflow: auto;

        .video-item {
          display: flex;
          align-items: center;
          min-height: 140px;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: var(--style-border);
          position: relative;

          .video-cover {
            width: 154px;
            height: 100px;
            margin-right: 20px;
          }

          .video-info {
            display: flex;
            flex-direction: column;

            .time {
              margin-bottom: 20px;
              margin-top: 5px;
            }
          }

          .video-action {
            position: absolute;
            height: 100%;
            right: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .detail {
            display: flex;
            align-items: center;
            gap: 40px;

            .info {
              display: flex;
              flex-direction: column;

              .text {
                color: var(--xz-secondtext);
                font-size: 12px;
              }

              .count {
                font-weight: bold;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
