import request from '@/utils/request'

export const getShenHeVideoList = (offset: number = 0, pageSize: number = 10) => {
  return request.get('/admin/shenhe/list', {
    params: {
      offset,
      pageSize
    }
  })
}

export const getShenHeCountAPI = () => {
  return request.get('/admin/shenhe/count')
}

export const videoPassAPI = (id: number, pass: boolean) => {
  return request.post('/admin/shenhe/pass', {
    id,
    pass
  })
}

export const getPlatformDataAPI = () => {
  return request.get('/admin/platform/data')
}

export const getPlatformWeekDataAPI = () => {
  return request.get('/admin/platform/week')
}
