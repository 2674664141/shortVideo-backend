<template>
  <div class="search">
    <Header></Header>
    <div @click="handleToIndex" class="exit">
      <i class="ri-close-line"></i>
    </div>
    <div class="main-content">
      <div class="category-list">
        <div class="category-item active">
          <span>综合</span>
        </div>
      </div>
      <div class="video-area">
        <div class="video-list">
          <div
            class="video-item"
            @click="handlePlayVideo(video)"
            v-for="video in searchResultList"
            :key="video.id"
          >
            <div class="video-cover">
              <img :src="video.coverUrl" alt="" />
              <div class="video-play-detail">
                <div class="play-info">
                  <div class="play-count">
                    <i class="ri-play-circle-line"></i>
                    <span class="count">{{ video.playCount }}</span>
                  </div>
                  <div class="play-like">
                    <i class="ri-heart-line"></i>
                    <span class="count">{{ video.likeCount }}</span>
                  </div>
                  <div class="play-duration">{{ parseVideoDuration(video.duration) }}</div>
                </div>
              </div>
            </div>
            <div class="video-info">
              <div class="video-title">{{ video.description }}</div>
              <div class="video-detail">
                <span>@{{ video.author }}</span>
                <span>{{ parsePublishTime(video.createdTime?.toString()) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getVideoSearchListAPI } from '@/api/video'
import Header from '@/common/Header.vue'
import type { VideoVO } from '@/type'
import { parsePublishTime, parseVideoDuration } from '@/utils'
import { playVideo } from '@/utils/video'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const route = useRoute()

const searchResultList = ref<VideoVO[]>([])

const handlePlayVideo = (video: VideoVO) => {
  playVideo(video)
}

const getSearchDataList = async (q: string) => {
  const res = await getVideoSearchListAPI(q)
  if (res.data.code === 200) {
    searchResultList.value = res.data.data
  }
}

watch(
  () => route.query.q,
  async (q) => {
    getSearchDataList(q as string)
  },
  {
    immediate: true
  }
)

const handleToIndex = () => {
  router.push({
    path: '/'
  })
}
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
  background-color: var(--xz-card-bg);

  .exit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 10px;
    left: 20px;
    z-index: 11;
    height: 40px;
    width: 40px;
    color: var(--xz-secondtext);
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--xz-fontcolor);
    }

    i {
      font-size: 2rem;
    }
  }

  .category-list {
    display: flex;
    align-items: center;
    gap: 40px;

    .category-item {
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      color: var(--xz-secondtext);
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        color: var(--xz-fontcolor);
      }

      &.active::before {
        content: '';
        display: block;
        width: 16px;
        height: 3px;
        background: #fe2c55;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 9px);
      }
    }
  }

  .main-content {
    width: 100vw;
    padding-top: var(--xz-header-height);
    padding-left: 30px;
    padding-right: 30px;
    height: 100%;
    background-color: var(--xz-card-bg);
  }
}

.video-area {
  margin-top: 20px;

  .video-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .video-item {
      width: calc(20% - 16px);
      cursor: pointer;
      position: relative;

      .video-cover {
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
        width: 100%;
        height: 140px;
        position: relative;

        img {
          width: 100%;
          object-fit: cover;
        }

        .video-play-detail {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 10px;
          height: 30px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(
            transparent 0%,
            rgba(0, 0, 0, 0.05) 15%,
            rgba(0, 0, 0, 0.15) 35%,
            rgba(0, 0, 0, 0.4) 70%,
            rgba(0, 0, 0, 0.55) 100%
          );

          .play-info {
            display: flex;
            gap: 8px;
            align-items: center;
            width: 100%;
            font-size: 14px;

            .play-count,
            .play-like {
              display: flex;
              gap: 2px;
            }

            .play-duration {
              margin-left: auto;
            }
          }
        }
      }

      .video-title {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
      }

      .video-detail {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--xz-secondtext);
        font-size: 14px;
      }
    }
  }
}
</style>
