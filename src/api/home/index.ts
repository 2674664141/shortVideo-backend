import request from '@/utils/request'

export const getJingXuanVideoListAPI = (offset: number = 0, pageSize: number = 18) => {
  return request.get('/video/jingxuan', {
    params: {
      offset,
      pageSize
    }
  })
}
