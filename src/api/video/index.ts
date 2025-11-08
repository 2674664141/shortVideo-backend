import type { VideoDTO } from '@/type'
import request from '@/utils/request'

export const uploadChunkAPI = (data: FormData) => {
  return request.post('/upload/chunk', data)
}

export const mergeChunksAPI = (data: any) => {
  return request.post('/upload/merge', data)
}

export const tougaoAPI = (data: VideoDTO) => {
  return request.post('/video/tougao', data)
}

export const getTuiJianVideoAPI = (offset: number, pageSize: number) => {
  return request.get('/video/tuijian', {
    params: {
      offset,
      pageSize
    }
  })
}

export const getCategoryVideoAPI = (categoryId: number) => {
  return request.get(`/video/category/${categoryId}`)
}

export const getVideoInfoAPI = (videoId: number) => {
  return request.get(`/video/info/${videoId}`)
}

export const videoLikeAPI = (videoId: number) => {
  return request.post(`/video/like/${videoId}`)
}

export const videoFavoriteAPI = (videoId: number) => {
  return request.post(`/video/favorite/${videoId}`)
}

export const videoPlayAPI = (videoId: number) => {
  return request.post(`/video/play/${videoId}`)
}

export const getVideoInteractionStatusAPI = (videoId: number) => {
  return request.get(`/video/interaction/${videoId}`)
}

export const getUserVideoByTabAPI = (tab: string) => {
  return request.get('/video/user/tab', {
    params: {
      tab
    }
  })
}

export const getUserVideoListAPI = () => {
  return request.get(`/video/user/list`)
}

export const getVideoCountAPI = () => {
  return request.get('/video/count')
}

export const deleteVideoByIdAPI = (videoId: number) => {
  return request.delete(`/video/delete/${videoId}`)
}

export const getUserVideoDataAPI = () => {
  return request.get('/video/user/data')
}

export const getVideoSearchListAPI = (keyword: string) => {
  return request.get('/video/search', {
    params: {
      keyword
    }
  })
}

export const shareVideoAPI = (videoId: number) => {
  return request.post(`/video/share/${videoId}`)
}
