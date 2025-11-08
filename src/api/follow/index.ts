import request from '@/utils/request'

export const followAPI = (userId: number) => {
  return request.post(`/follow/guanzhu/${userId}`)
}

export const getFollowingAPI = () => {
  return request.get('/follow/following')
}

export const getFollowersAPI = () => {
  return request.get('/follow/followers')
}
