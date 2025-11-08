import { tougaoAPI } from '@/api/video'
import type { TouGaoState } from '@/type'
import { getFileName, message } from '@/utils'
import { uploadFile } from '@/utils/file'
import { getVideoMetaInfo } from '@/utils/video'
import { defineStore } from 'pinia'

const createStore = defineStore('create', {
  state: (): TouGaoState => ({
    videoInfo: {
      video: undefined,
      videoUrl: '',
      videoName: '',
      videoTitle: '',
      videoCover: '',
      videoType: 1,
      videoCategory: '动画',
      videoCategoryId: 1,
      videoDesc: '',
      videoDuration: 0,
      videoTag: []
    },
    uploadInfo: {
      total: 0,
      current: 0,
      progress: 0,
      completed: false
    }
  }),
  actions: {
    async uploadVideo(file: File) {
      this.videoInfo.video = file
      this.videoInfo.videoName = getFileName(file.name)
      const { cover, duration } = await getVideoMetaInfo(file)
      this.videoInfo.videoCover = cover
      this.videoInfo.videoDuration = duration
      const res = await uploadFile(file, (progress: number) => {
        this.uploadInfo.progress = progress
      })
      if (res.data.code === 200) {
        this.videoInfo.videoUrl = res.data.data
        this.uploadInfo.completed = true
        return message({
          type: 'success',
          message: '视频上传成功',
          duration: 3000
        })
      }
      return message({
        type: 'error',
        message: '视频上传失败，请检查网络设置',
        duration: 3000
      })
    },
    async submitVideo() {
      const res = await tougaoAPI({
        title: this.videoInfo.videoTitle,
        description: this.videoInfo.videoDesc,
        coverUrl: this.videoInfo.videoCover,
        videoUrl: this.videoInfo.videoUrl,
        duration: this.videoInfo.videoDuration,
        tags: this.videoInfo.videoTag.join(','),
        categoryId: this.videoInfo.videoCategoryId, // 默认分类为1
        status: 1,
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0
      })
      if (res.data.code === 200) {
        message({
          type: 'success',
          message: '投稿成功',
          duration: 3000
        })
        return true
      }
      message({
        type: 'error',
        message: res.data.message,
        duration: 3000
      })
      return false
    },
    async submitCover(cover: File) {
      const res = await uploadFile(cover, (progress: number) => {
        console.log(progress)
      })
      if (res.data.code === 200) {
        this.videoInfo.videoCover = res.data.data
      }
    },
    checkSubmit() {
  // 1. 标题：去空格后不能为空
  const hasTitle = this.videoInfo.videoTitle?.trim().length > 0;
  // 2. 标签：至少1个
  const hasTag = this.videoInfo.videoTag.length > 0;
  // 3. 封面：非空
  const hasCover = this.videoInfo.videoCover?.trim().length > 0;
  // 4. 视频URL：非空
  const hasVideoUrl = this.videoInfo.videoUrl?.trim().length > 0;
  // 5. 分类：必须选择（值不为默认的空或无效值，比如你的分类默认是1，需确保选中了有效分类）
  const hasCategory = this.videoInfo.videoCategoryId !== undefined && this.videoInfo.videoCategoryId > 0;

  // 打印日志排查
  console.log('校验结果：', { hasTitle, hasTag, hasCover, hasVideoUrl, hasCategory });

  // 所有必填项都满足才返回true
  return hasTitle  && hasCover && hasVideoUrl && hasCategory;
}
  }
})

export default createStore
