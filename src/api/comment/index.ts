import request from '@/utils/request'

export const getVideoCommentAPI = (videoId: number) => {
  return request.get(`/comment/video/${videoId}`)
}

export const videoCommentAPI = (data: any) => {
  return request.post('/comment/video', data)
}
