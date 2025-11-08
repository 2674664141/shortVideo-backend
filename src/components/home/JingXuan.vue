<template>
  <div class="jingxuan">
    <div class="category">
      <div class="category-list">
        <div
          @click="handleAllCategoryClick"
          class="category-item"
          :class="{ active: currentIndex === -1 }"
        >
          <span>全部</span>
        </div>
        <div
          class="category-item"
          :class="{
            active: currentIndex === index
          }"
          v-for="(item, index) in VIDEO_CATEGORY"
          @click="handleCategoryClick(item.value, index)"
          :key="item.value"
        >
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div ref="videoListRef" @scroll="handleScroll" class="video-container">
      <div class="video-list">
        <div
          class="video-item"
          @click="handlePlayVideo(video)"
          v-for="(video, index) in videoList"
          :key="index"
        >
          <div class="video-cover">
            <div class="img-container">
              <img :src="video.coverUrl" alt="" />
            </div>
            <div class="video-detail">
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
            <div class="video-title">{{ video.title }}</div>
            <div class="video-bottom">
              <span>
                <span class="video-author">@{{ video.author }}</span>
                <span class="video-create">
                   ·  {{ parsePublishTime(video.createdTime?.toString()) }}</span
                >
              </span>
              <span class="video-action">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 22 23"
                >
                  <path
                    d="M15.583 11.5a1.833 1.833 0 1 1 3.667 0 1.833 1.833 0 0 1-3.667 0zM9.167 11.5a1.833 1.833 0 1 1 3.666 0 1.833 1.833 0 0 1-3.666 0zM4.583 9.667a1.833 1.833 0 1 0 0 3.666 1.833 1.833 0 0 0 0-3.666z"
                    fill="#fff"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div
          :style="{
            color: 'var(--xz-secondtext)',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            gridColumn: '1 / span 3',
            marginTop: '10px',
            marginBottom: '10px'
          }"
          class="tips"
        >
          {{ isEnd ? '没有更多视频了' : '下滑获取更多的数据' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getJingXuanVideoListAPI } from '@/api/home'
import { getCategoryVideoAPI, getVideoInfoAPI } from '@/api/video'
import { VIDEO_CATEGORY } from '@/constant'
import type { VideoVO } from '@/type'
import { debounce, message, parsePublishTime, parseVideoDuration } from '@/utils'
import { playVideo } from '@/utils/video'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const currentIndex = ref(-1)

const currentPage = ref(0)

const pageSize = 18

const isEnd = ref(false)

const route = useRoute()

const videoList = ref<VideoVO[]>()

const videoListRef = ref<HTMLDivElement>()

watch(
  () => route.query.videoId,
  async () => {
    if (route.query.videoId) {
      const id = route.query.videoId as string
      const res = await getVideoInfoAPI(+id)
      if (res.data.code === 200) {
        playVideo(res.data.data)
      }
    }
  },
  {
    immediate: true
  }
)

const handleCategoryClick = async (categoryId: number, index: number) => {
  currentIndex.value = index
  const res = await getCategoryVideoAPI(categoryId)
  if (res.data.code === 200) {
    videoList.value = res.data.data
  }
}

const handleAllCategoryClick = async () => {
  currentIndex.value = -1
  const res = await getJingXuanVideoListAPI()
  if (res.data.code === 200) {
    videoList.value = res.data.data
  }
}

const handleScroll = debounce(() => {
  if (videoListRef.value) {
    const scrollTop = videoListRef.value.scrollTop
    const clientHeight = videoListRef.value.clientHeight
    const scrollHeight = videoListRef.value.scrollHeight
    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      if (isEnd.value) {
        return message({
          type: 'info',
          message: '已经到底啦，没有更多视频了'
        })
      }
      currentPage.value++
      getVideoList(currentPage.value * pageSize, pageSize)
    }
  }
}, 300)

const handlePlayVideo = (video: VideoVO) => {
  playVideo(video)
}

const getVideoList = async (offset: number = 0, pageSize: number = 18) => {
  const res = await getJingXuanVideoListAPI(offset, pageSize)
  if (res.data.code === 200) {
    if (res.data.data.length === 0) {
      message({
        type: 'info',
        message: '已经到底啦，没有更多视频了'
      })
      return (isEnd.value = true)
    }
    if (videoList.value) {
      videoList.value = [...videoList.value!, ...res.data.data]
    } else {
      videoList.value = res.data.data
    }
  }
}

onMounted(() => {
  getVideoList()
})
</script>

<style scoped lang="scss">
.jingxuan {
  padding: 10px 20px;
  padding-right: 0;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .category {
    height: 40px;
    margin-bottom: 20px;

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
  }

  .video-container {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;

    .video-list {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(310px, 1fr));
      gap: 20px;
      padding-right: 20px;
      overflow-y: scroll;

      .video-item {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        min-width: 310px;
        height: fit-content;

        &:hover {
          .video-action {
            opacity: 1 !important;
          }
        }

        .video-cover {
          height: 296px;
          width: 100%;
          position: relative;
          overflow: hidden;

          .img-container {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            height: 100%;

            img {
              width: 100%;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              transition: all 0.6s ease 0s;
              object-fit: cover;
            }
          }

          .video-detail {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10px;
            height: 40px;
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

        .video-info {
          padding-top: 10px;
          display: flex;
          flex-direction: column;

          .video-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .video-bottom {
            color: var(--xz-secondtext);
            font-size: 14px;
            position: relative;

            .video-action {
              transition: all 0.3s ease;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translate(0, -50%);
              display: flex;
              opacity: 0;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
