import { getVideoInfoAPI } from '@/api/video'
import VideoPlayer from '@/common/VideoPlayer.vue'
import type { VideoVO } from '@/type'
import { createApp, h, ref } from 'vue'

interface VideoMetaInfo {
  cover: string
  duration: number
  width: number
  height: number
}

/**
 * 获取视频第一帧作为Base64封面
 * @param {File} videoFile - 视频文件对象
 * @param {number} [width=320] - 缩略图宽度（保持比例）
 * @returns {Promise<string>} Base64格式的图片数据
 */
export const getVideoMetaInfo = (videoFile: File, width = 960): Promise<VideoMetaInfo> => {
  return new Promise((resolve, reject) => {
    // 1. 创建视频元素
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    video.preload = 'auto'
    video.crossOrigin = 'anonymous'
    // 2. 设置视频源
    video.src = URL.createObjectURL(videoFile)

    // 3. 监听视频元数据加载
    video.onloadeddata = () => {
      // 计算等比缩放的高度
      const height = (video.videoHeight / video.videoWidth) * width

      // 设置canvas尺寸
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(video, 0, 0, width, height)
      const base64 = canvas.toDataURL('image/jpeg')
      URL.revokeObjectURL(video.src)
      resolve({
        cover: base64,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      })
    }
    video.addEventListener('error', (e) => {
      reject(new Error('视频加载失败: ' + e.message))
    })
  })
}

export const playVideo = (video: VideoVO) => {
  const mountNode = document.createElement('div')
  mountNode.className = 'video-player-box'
  document.body.appendChild(mountNode)
  // 使用ref
  const videoRef = ref(video)
  const app = createApp({
    render() {
      return h(VideoPlayer, {
        videoInfo: videoRef.value,
        fullPlay: true,
        onCloseVideoPlayer() {
          app.unmount()
          mountNode.remove()
        },
        async onUpdateVideoInfo(videoId: number) {
          const res = await getVideoInfoAPI(videoId)
          if (res.data.code === 200) {
            videoRef.value = res.data.data
          }
        },
        onVnodeUnmounted() {
          app.unmount()
          mountNode.remove()
        }
      })
    }
  })
  app.mount(mountNode)

  return {
    close: () => {
      app.unmount()
    }
  }
}
