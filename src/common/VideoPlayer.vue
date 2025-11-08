<template>
  <div
    class="video-player"
    :class="{ active: isFocus }"
    @mouseenter="handleVideoMouseEnter"
    @mouseleave="handleVideoMouseLeave"
    @mousemove="handleVideoMouseMove"
    ref="videoPlayer"
  >
    <div
      :style="{
        width: showComment ? '70%' : '100%',
        transition: 'width 0.3s ease-in-out'
      }"
      class="video-player-wrapper"
    >
      <div class="video-player-container">
        <video
          @click.stop="hanldeVideoClick"
          @playing="handleVideoPlaying"
          @timeupdate="handleVideoTimeUpdate"
          @pause="handleVideoPause"
          @ended="handleVideoEnd"
          autoplay
          :src="props.videoInfo?.videoUrl"
          :style="{
            cursor: isFocus ? 'pointer' : 'none'
          }"
          class="video"
          ref="video"
        ></video>
        <div class="interaction-area">
          <div class="interaction-list">
            <div class="interaction-item">
              <div class="author-info">
                <div class="author-avatar">
                  <el-tooltip content="进入作者主页" placement="left">
                    <img :src="props.videoInfo?.avatar" alt="" />
                  </el-tooltip>
                  <el-tooltip
                    :content="interactionInfo.isFollowingAuthor ? '取消关注' : '关注作者'"
                    placement="left"
                  >
                    <div @click="handleFollow" class="follow-icon">
                      <svg
                        v-show="!interactionInfo.isFollowingAuthor"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        focusable="false"
                      >
                        <g filter="url(#filter0_d_38277_51136)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M16 26.7319C22.6274 26.7319 28 21.3594 28 14.7319C28 8.10452 22.6274 2.73193 16 2.73193C9.37258 2.73193 4 8.10452 4 14.7319C4 21.3594 9.37258 26.7319 16 26.7319Z"
                            fill="#FE2C55"
                          ></path>
                        </g>
                        <path
                          d="M12 15.7319C11.4477 15.7319 11 15.2842 11 14.7319V14.7319C11 14.1796 11.4477 13.7319 12 13.7319H20C20.5523 13.7319 21 14.1796 21 14.7319V14.7319C21 15.2842 20.5523 15.7319 20 15.7319H12Z"
                          fill="white"
                        ></path>
                        <path
                          d="M15 10.7319C15 10.1796 15.4477 9.73193 16 9.73193V9.73193C16.5523 9.73193 17 10.1796 17 10.7319V18.7319C17 19.2842 16.5523 19.7319 16 19.7319V19.7319C15.4477 19.7319 15 19.2842 15 18.7319V10.7319Z"
                          fill="white"
                        ></path>
                        <defs>
                          <filter
                            id="filter0_d_38277_51136"
                            x="0"
                            y="0.732"
                            width="32"
                            height="32"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            ></feColorMatrix>
                            <feOffset dy="2"></feOffset>
                            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                            ></feColorMatrix>
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_38277_51136"
                            ></feBlend>
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_38277_51136"
                              result="shape"
                            ></feBlend>
                          </filter>
                        </defs>
                      </svg>
                      <div
                        v-show="interactionInfo.isFollowingAuthor"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          background-color: #fe2c55;
                          border-radius: 50%;
                          width: 18px;
                          height: 18px;
                          position: absolute;
                          left: 50%;
                          transform: translate(-50%, -70%);
                        "
                      >
                        <i class="ri-close-line"></i>
                      </div>
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="interaction-item">
              <el-tooltip :content="interactionInfo.isLiked ? '取消点赞' : '点赞'" placement="left">
                <div @click="handleLikeVideo" class="video-like">
                  <div :class="{ active: interactionInfo.isLiked }" class="video-like-icon icon">
                    <i class="ri-heart-fill"></i>
                  </div>
                  <div class="video-like-count text">{{ props.videoInfo?.likeCount }}</div>
                </div>
              </el-tooltip>
            </div>
            <div class="interaction-item">
              <el-tooltip content="评论" placement="left">
                <div @click="handleOpenComment" class="video-comment">
                  <div class="video-comment-icon icon">
                    <i class="ri-message-3-fill"></i>
                  </div>
                  <div class="video-like-count text">{{ props.videoInfo?.commentCount }}</div>
                </div>
              </el-tooltip>
            </div>
            <div class="interaction-item">
              <el-tooltip content="收藏" placement="left">
                <div @click="handleFavoriteVideo" class="video-favorite">
                  <div
                    :class="{ active: interactionInfo.isFavorited }"
                    class="video-favorite-icon icon"
                  >
                    <i class="ri-star-fill"></i>
                  </div>
                  <div class="video-like-count text">{{ props.videoInfo?.favoriteCount }}</div>
                </div>
              </el-tooltip>
            </div>
            <div class="interaction-item">
              <el-tooltip content="转发" placement="left">
                <div @click="handleShareVideo(props.videoInfo?.id)" class="video-share">
                  <div class="video-comment-icon icon">
                    <i class="ri-share-forward-fill"></i>
                  </div>
                  <div class="video-like-count text">{{ props.videoInfo?.shareCount }}</div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div @click="handleCloseVideoPlayer" v-if="props.fullPlay" class="close-video">
          <div class="close-icon">
            <i class="ri-close-line"></i>
          </div>
        </div>
      </div>
      <div class="video-player-controls">
        <div class="video-player-inner-controls">
          <div class="video-player-left-controls">
            <div class="video-player-controls-play">
              <div @click.stop="video?.play()" v-show="!isPlaying" class="play-icon">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                  style="font-size: 32px"
                >
                  <path
                    d="M23.5 15.134C24.1667 15.5189 24.1667 16.4811 23.5 16.866L12.25 23.3612C11.5833 23.7461 10.75 23.265 10.75 22.4952L10.75 9.50481C10.75 8.73501 11.5833 8.25388 12.25 8.63878L23.5 15.134Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div @click.stop="video?.pause()" v-show="isPlaying" class="pause-icon">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                  style="font-size: 32px"
                >
                  <path
                    d="M10 8C9.44772 8 9 8.44772 9 9V23C9 23.5523 9.44772 24 10 24H13C13.5523 24 14 23.5523 14 23V9C14 8.44772 13.5523 8 13 8H10Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M19 8C18.4477 8 18 8.44772 18 9V23C18 23.5523 18.4477 24 19 24H22C22.5523 24 23 23.5523 23 23V9C23 8.44772 22.5523 8 22 8H19Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="video-player-controls-duration">
              <span class="time-current">{{ parseVideoDuration(currentPlayTime) }}</span>
              <span class="time-separator">/</span>
              <span class="time-duration">{{
                parseVideoDuration(props.videoInfo?.duration || 0)
              }}</span>
            </div>
          </div>
          <div class="video-player-center-controls">
            <div class="video-player-progress">
              <div class="video-player-progress-outer">
                <div class="progress-list">
                  <div class="progress-inner">
                    <div
                      :style="{
                        width: `${videoPlayPercent}%`
                      }"
                      class="progress-played"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="video-player-right-controls">
            <div
              v-show="!isFullScreen"
              @click="handleVideoFullScreen"
              class="controls-item fullscreen"
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
                style="font-size: 32px"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.75 8.25C9.54086 8.25 7.75 10.0409 7.75 12.25V12.75V13.75H9.75V12.75V12.25C9.75 11.1454 10.6454 10.25 11.75 10.25H12.25H13.25V8.25H12.25H11.75ZM20.25 8.25C22.4591 8.25 24.25 10.0409 24.25 12.25V12.75V13.75H22.25V12.75V12.25C22.25 11.1454 21.3546 10.25 20.25 10.25H19.75H18.75V8.25H19.75H20.25ZM7.75 19.75C7.75 21.9591 9.54086 23.75 11.75 23.75H12.25H13.25V21.75H12.25H11.75C10.6454 21.75 9.75 20.8546 9.75 19.75V19.25V18.25H7.75V19.25V19.75ZM20.25 23.75C22.4591 23.75 24.25 21.9591 24.25 19.75V19.25V18.25H22.25V19.25V19.75C22.25 20.8546 21.3546 21.75 20.25 21.75H19.75H18.75V23.75H19.75H20.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div
              @click="handleExitFullScreen"
              v-show="isFullScreen"
              class="controls-item exitFullscreen"
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
                style="font-size: 32px"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.25 13.75C11.4591 13.75 13.25 11.9591 13.25 9.75V9.25V8.25H11.25V9.25V9.75C11.25 10.8546 10.3546 11.75 9.25 11.75H8.75H7.75V13.75H8.75H9.25ZM22.75 13.75C20.5409 13.75 18.75 11.9591 18.75 9.75V9.25V8.25H20.75V9.25V9.75C20.75 10.8546 21.6454 11.75 22.75 11.75H23.25H24.25V13.75H23.25H22.75ZM13.25 22.25C13.25 20.0409 11.4591 18.25 9.25 18.25H8.75H7.75V20.25H8.75H9.25C10.3546 20.25 11.25 21.1454 11.25 22.25V22.75V23.75H13.25V22.75V22.25ZM22.75 18.25C20.5409 18.25 18.75 20.0409 18.75 22.25V22.75V23.75H20.75V22.75V22.25C20.75 21.1454 21.6454 20.25 22.75 20.25H23.25H24.25V18.25H23.25H22.75Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div @click="handleToggleVolume" class="controls-item volume">
              <svg
                v-show="video?.muted"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
                style="font-size: 32px"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.4525 8.11043L10.7454 7.40332L9.33115 8.81753L10.0383 9.52464L23.4733 22.9597L24.1804 23.6668L25.5946 22.2526L24.8875 21.5455L22.4054 19.0634V10.6468C22.4054 8.31652 19.8647 6.87595 17.8651 8.0724L13.8292 10.4872L11.4525 8.11043ZM15.2874 11.9454L20.4054 17.0634V10.6468C20.4054 9.87002 19.5585 9.38983 18.8919 9.78865L15.2874 11.9454ZM20.0501 22.357L21.4669 23.7738C20.5453 24.6377 19.1017 24.9064 17.8651 24.1664L11.6291 20.4352H9.4054C7.74854 20.4352 6.4054 19.0921 6.4054 17.4352V14.8036C6.4054 13.1468 7.74854 11.8036 9.4054 11.8036H9.49674L11.4967 13.8036H9.4054C8.85311 13.8036 8.4054 14.2513 8.4054 14.8036V17.4352C8.4054 17.9875 8.85311 18.4352 9.4054 18.4352H11.6291C11.9907 18.4352 12.3456 18.5333 12.656 18.719L18.8919 22.4502C19.2856 22.6857 19.7422 22.6147 20.0501 22.357Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                v-show="!video?.muted"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                focusable="false"
                style="font-size: 32px"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.6523 8.02754C15.6339 6.57433 18.4265 7.98939 18.4265 10.4467V21.5532C18.4265 24.0105 15.6339 25.4256 13.6524 23.9725L9.86308 21.1936C9.69156 21.0679 9.4844 21.0001 9.27171 21.0001H8.42645C6.7696 21.0001 5.42645 19.6569 5.42645 18.0001V14.0001C5.42645 12.3432 6.7696 11.0001 8.42645 11.0001H9.27169C9.48439 11.0001 9.69155 10.9322 9.86307 10.8064L13.6523 8.02754ZM16.4265 10.4467C16.4265 9.62761 15.4956 9.15592 14.8351 9.64033L11.0458 12.4192C10.5313 12.7966 9.90979 13.0001 9.27169 13.0001H8.42645C7.87417 13.0001 7.42645 13.4478 7.42645 14.0001V18.0001C7.42645 18.5523 7.87417 19.0001 8.42645 19.0001H9.27171C9.90979 19.0001 10.5313 19.2035 11.0458 19.5808L14.8351 22.3596C15.4956 22.844 16.4265 22.3723 16.4265 21.5532V10.4467ZM21.2263 11.8253L21.8066 12.6397C22.4855 13.5924 22.8857 14.7511 22.8857 16.0001C22.8857 17.249 22.4855 18.4078 21.8066 19.3605L21.2263 20.1749L19.5975 19.0143L20.1778 18.1999C20.6263 17.5704 20.8857 16.8142 20.8857 16.0001C20.8857 15.1859 20.6263 14.4297 20.1778 13.8003L19.5975 12.9859L21.2263 11.8253ZM24.8066 10.4994L24.2263 9.68498L22.5975 10.8456L23.1778 11.66C24.0603 12.8986 24.5736 14.392 24.5736 16.0004C24.5736 17.6089 24.0603 19.1023 23.1778 20.3408L22.5975 21.1552L24.2263 22.3158L24.8066 21.5014C25.9195 19.9396 26.5736 18.0436 26.5736 16.0004C26.5736 13.9572 25.9195 12.0612 24.8066 10.4994Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div class="controls-item speed">
              <div class="text">倍数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :style="{
        width: showComment ? '30%' : '0'
      }"
      class="video-player-side"
    >
      <Comment @wheel.stop v-model:show="showComment" :video-info="props.videoInfo"></Comment>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getVideoInteractionStatusAPI,
  shareVideoAPI,
  videoFavoriteAPI,
  videoLikeAPI,
  videoPlayAPI
} from '@/api/video'
import type { VideoVO } from '@/type'
import { debounce, message, parseVideoDuration } from '@/utils'
import { ElTooltip } from 'element-plus'
import { onMounted, reactive, ref, watch } from 'vue'
import Comment from './Comment.vue'
import userStore from '@/store/user'
import { followAPI } from '@/api/follow'

const uStore = userStore()

const video = ref<HTMLVideoElement | null>(null)

const videoPlayer = ref<HTMLDivElement | null>(null)

const videoPlayPercent = ref(0)

const currentPlayTime = ref(0)

const isFullScreen = ref(false)

const isPlaying = ref(false)

const isFocus = ref(false)

const showComment = ref(false)

const props = defineProps<{
  videoInfo?: VideoVO
  fullPlay: boolean
}>()

const interactionInfo = reactive({
  isLiked: false,
  isFavorited: false,
  isFollowingAuthor: false
})

const emits = defineEmits(['closeVideoPlayer', 'updateVideoInfo'])

const hanldeVideoClick = () => {
  if (video.value) {
    isFocus.value = true
    deactiveVideo()
    video.value.paused ? video.value.play() : video.value.pause()
  }
}

const handleVideoPlaying = () => {
  isPlaying.value = true
  videoPlayPercent.value = getVideoPlayPercent()
}

const handleVideoPause = () => {
  isPlaying.value = false
}

const handleShareVideo = async (videoId?: number) => {
  if (videoId) {
    window.navigator.clipboard.writeText(`http://localhost:5173/#/jingxuan?videoId=${videoId}`)
    message({
      type: 'success',
      message: '分享链接已经复制在剪切板'
    })
    await shareVideoAPI(videoId)
    emits('updateVideoInfo', videoId)
  }
}

const handleVideoTimeUpdate = () => {
  videoPlayPercent.value = getVideoPlayPercent()
}

const handleVideoEnd = () => {
  // 重新播放视频
  if (video.value) {
    video.value.currentTime = 0
    video.value.play()
  }
}

const handleVideoMouseEnter = () => {
  isFocus.value = true
}

const handleVideoMouseMove = () => {
  isFocus.value = true
  deactiveVideo()
}

const deactiveVideo = debounce(() => {
  isFocus.value = false
}, 2000)

const handleVideoMouseLeave = () => {
  isFocus.value = false
}

const handleVideoFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  videoPlayer.value?.requestFullscreen()
}

const handleExitFullScreen = () => {
  isFullScreen.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

const handleLikeVideo = async () => {
  if (props.videoInfo?.id) {
    const res = await videoLikeAPI(props.videoInfo.id)
    if (res.data.code === 200) {
      interactionInfo.isLiked = res.data.data.isLike
      emits('updateVideoInfo', props.videoInfo.id)
    }
  }
}

const handleOpenComment = () => {
  showComment.value = !showComment.value
}

const handleToggleVolume = () => {
  if (video.value) {
    video.value.muted = !video.value.muted
  }
}

const handleFollow = async () => {
  if (props.videoInfo?.userId) {
    const res = await followAPI(props.videoInfo.userId)
    if (res.data.code === 200) {
      if (res.data.data) {
        message({
          type: 'success',
          message: '关注成功'
        })
      } else {
        message({
          type: 'success',
          message: '取消关注成功'
        })
      }
      uStore.getUserInfo()
      emits('updateVideoInfo', props.videoInfo.id)
    }
  }
}

const handleFavoriteVideo = async () => {
  if (props.videoInfo?.id) {
    const res = await videoFavoriteAPI(props.videoInfo.id)
    if (res.data.code === 200) {
      interactionInfo.isFavorited = res.data.data.isFavorite
      emits('updateVideoInfo', props.videoInfo.id)
    }
  }
}

const handleCloseVideoPlayer = () => {
  emits('closeVideoPlayer')
}

const getVideoPlayPercent = () => {
  if (video.value) {
    currentPlayTime.value = video.value.currentTime
    // 获取播放进度
    const currentTime = video.value.currentTime
    // 获取视频总时长
    const duration = video.value.duration
    // 计算播放进度百分比
    const progress = (currentTime / duration) * 100
    return progress
  }
  return 0
}

watch(
  () => props.videoInfo,
  async () => {
    if (props.videoInfo?.id) {
      await videoPlayAPI(props.videoInfo.id)
      const interactionStatus = await getVideoInteractionStatusAPI(props.videoInfo.id)
      interactionInfo.isLiked = interactionStatus.data.data.isLiked === '1'
      interactionInfo.isFavorited = interactionStatus.data.data.isFavorited === '1'
      interactionInfo.isFollowingAuthor = interactionStatus.data.data.isFollowingAuthor === '1'
    }
  }
)

onMounted(async () => {
  if (props.videoInfo?.id) {
    await videoPlayAPI(props.videoInfo.id)
    const interactionStatus = await getVideoInteractionStatusAPI(props.videoInfo.id)
    interactionInfo.isLiked = interactionStatus.data.data.isLiked === '1'
    interactionInfo.isFavorited = interactionStatus.data.data.isFavorited === '1'
    interactionInfo.isFollowingAuthor = interactionStatus.data.data.isFollowingAuthor === '1'
  }
})
</script>

<style scoped>
.video-player {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: relative;
  cursor: pointer;
  background: #000;
  font-size: 14px;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
  display: flex;

  .video-player-container {
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    bottom: 48px;
    overflow: hidden;
    border: 0;
    margin: 0;
    padding: 0;

    .video {
      width: 100%;
      height: 100%;
      outline: none;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .video-player-controls {
    height: 48px;
    z-index: 13;
    background-image: linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%) !important;
    transition: opacity 0.5s, visibility 0.5s;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .video-player-inner-controls {
      height: 46px;
      align-items: center;
      left: 0;
      right: 0;
      justify-content: space-between;
      display: flex;
      position: absolute;
      bottom: 0;

      .video-player-left-controls {
        z-index: 3;
        height: 40px;
        flex: 1;
        align-items: center;
        display: flex;
        margin-left: 8px;
        position: relative;
        opacity: 0.5;
        transition: all 0.3s ease;

        .video-player-controls-play {
          margin-right: 4px;
          margin-left: 0;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;

          .play-icon {
            cursor: pointer;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            display: block;
          }
        }

        .video-player-controls-duration {
          margin-left: 0;
          margin-right: 0;
          min-width: 40px;
          color: #fff;
          text-align: center;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          line-height: 40px;
          display: inline-block;

          .time-current {
            margin-left: 0;
            min-width: 40px;
          }

          .time-separator {
            margin: 0 4px;
          }

          .time-duration {
            min-width: 40px;
          }

          .time-current,
          .time-separator,
          .time-duration {
            font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
            color: #fff !important;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            display: inline-block;
            height: auto;
          }
        }

        .video-player-controls-play,
        .video-player-controls-duration {
          position: relative;
          fill: #fff;
          cursor: pointer;
          height: 40px;
        }
      }

      .video-player-center-controls {
        z-index: 2;
        top: -1px;
        transform: translateY(-50%);
        text-align: center;
        outline: none;
        padding: 5px 0;
        display: block;
        position: absolute;
        left: 0;
        right: 0;

        .video-player-progress {
          height: 12px;
          min-width: 10px;
          cursor: pointer;
          outline: none;
          flex: 1;
          align-items: center;
          display: flex;
          position: relative;
          top: 0;
          left: 0;
          right: 0;

          .video-player-progress-outer {
            height: 2px;
            width: 100%;
            cursor: pointer;
            position: relative;

            .progress-list {
              height: 100%;
              width: 100%;
              border-radius: inherit;
              display: flex;

              .progress-inner {
                flex: 1;
                background: rgba(255, 255, 255, 0.2);
                margin-right: 0;
                height: 100%;
                border-radius: inherit;
                pointer-events: none;
                transition: height 0.2s ease-in, opacity 0.2s ease-out;
                position: relative;

                .progress-played {
                  background: rgba(255, 255, 255, 0.4);
                  height: 100%;
                  width: 0;
                  border-radius: inherit;
                  display: block;
                  position: absolute;
                  top: 0;
                  left: 0;
                }
              }
            }
          }
        }
      }

      .video-player-right-controls {
        z-index: 2;
        height: 40px;
        align-items: center;
        margin-right: 16px;
        display: flex;
        flex-direction: row-reverse;
        flex-shrink: 1;
        position: relative;
        opacity: 0.5;
        transition: all 0.3s ease;

        .controls-item {
          height: 32px;
          margin-right: 4px;
        }

        .speed {
          text-align: center;
          min-width: auto;
          width: 40px;
          opacity: 0.9;
          margin-right: 4px;
          display: flex;
          justify-content: center;
          align-items: center;

          .text {
            color: #e4e4e6;
            text-align: center;
          }
        }
      }
    }
  }
}

.video-player.active {
  .video-player-left-controls,
  .video-player-right-controls,
  .close-video {
    opacity: 1 !important;
  }
}

.video-player-controls:hover {
  .video-player-left-controls,
  .video-player-right-controls,
  .close-video {
    opacity: 1 !important;
  }
}

.video-player-wrapper {
  height: 100%;
  z-index: 2;
  background-color: transparent;
  position: relative;

  .interaction-area {
    transform-origin: right bottom;
    transform: scale(1);
    z-index: 11;
    height: auto;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-right: 24px;
    display: flex;
    position: absolute;
    bottom: 60px;
    right: 0;
    transition: padding-right 0.3s;

    .interaction-list {
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
      flex-direction: column;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      margin-bottom: 0;
      display: flex;
      position: relative;
      transform: translateZ(0);

      .interaction-item {
        position: relative;
        vertical-align: bottom;

        .text {
          justify-content: center;
          align-items: center;
          font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
          font-size: 15px;
          line-height: 23px;
          display: flex;
        }

        .author-info {
          margin: 24px 0;
          position: relative;

          .follow-icon {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .icon {
          height: 45px;
          width: 45px;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 2rem;
          }
        }

        .video-like {
          position: relative;

          .video-like-icon.active {
            i {
              animation: video-like-active 0.5s ease-in-out forwards;
            }
          }
        }

        .video-favorite {
          position: relative;

          .video-favorite-icon.active {
            i {
              animation: video-favorite-active 0.5s ease-in-out forwards;
            }
          }
        }
      }
    }
  }

  .close-video {
    position: absolute;
    left: 25px;
    top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--xz-secondbg);
    height: 80px;
    width: 80px;
    border-radius: 50%;
    opacity: 0.5;
    transition: all 0.3s ease;

    i {
      font-size: 2.2rem;
      font-weight: bold;
      color: var(--xz-secondtext);
    }
  }
}
</style>
