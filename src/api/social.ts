import request from '../utils/request'
import type { VideoDetailResponse } from '../../src/type/social'

/**
 * 获取视频详情
 * @param id 视频ID
 * @returns 视频详情数据
 */
export const getVideoDetail = (id: string | number): Promise<VideoDetailResponse> => {
  return request.get(`/video/${id}`)
}

/**
 * 检查用户是否点赞过视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 是否点赞过
 */
export const checkVideoLike = (userId: number, videoId: number): Promise<any> => {
  return request.get(`/video/check?userId=${userId}&videoId=${videoId}`)
}

/**
 * 点赞视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 点赞结果
 */
export const likeVideo = (userId: number, videoId: number): Promise<any> => {
  return request.post(`/video/like`, { userId, videoId })
}

/**
 * 取消点赞视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 取消点赞结果
 */
export const unlikeVideo = (userId: number, videoId: number): Promise<any> => {
  return request.delete(`/video/like?userId=${userId}&videoId=${videoId}`)
}

/**
 * 检查用户是否收藏过视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 是否收藏过
 */
export const checkVideoFavorite = (userId: number, videoId: number): Promise<any> => {
  return request.get(`/favorites/video/check/simple?userId=${userId}&videoId=${videoId}`)
}

/**
 * 获取用户的收藏夹列表
 * @param userId 用户ID
 * @returns 收藏夹列表
 */
export const getFavoriteFolders = (userId: number): Promise<any> => {
  return request.get(`/favorites/folder/list?userId=${userId}`)
}

/**
 * 创建新的收藏夹
 * @param userId 用户ID
 * @param folderName 收藏夹名称
 * @returns 创建结果
 */
export const createFavoriteFolder = (userId: number, folderName: string): Promise<any> => {
  return request.get(`/favorites/folder/create?userId=${userId}&folderName=${folderName}`)
}

/**
 * 添加视频到收藏夹
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param folderIds 收藏夹ID数组
 * @returns 收藏结果
 */
export const addVideoToFavorites = (
  userId: number,
  videoId: number,
  folderIds: number[]
): Promise<any> => {
  return request.post(`/favorites/video/add`, { userId, videoId, folderIds })
}

/**
 * 从收藏夹中移除视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 取消收藏结果
 */
export const removeVideoFromFavorites = (userId: number, videoId: number): Promise<any> => {
  return request.get(`/favorites/video/removeAll?userId=${userId}&videoId=${videoId}`)
}

/**
 * 检查是否已关注
 * @param followerId 关注者ID（当前用户）
 * @param followingId 被关注者ID
 * @returns 是否已关注
 */
export const checkFollowStatus = (followerId: number, followingId: number): Promise<any> => {
  return request.get(`/api/follows/check?followerId=${followerId}&followingId=${followingId}`)
}

/**
 * 关注用户
 * @param followerId 关注者ID（当前用户）
 * @param followingId 被关注者ID
 * @returns 关注结果
 */
export const followUser = (followerId: number, followingId: number): Promise<any> => {
  return request.post(`/api/follows`, { followerId, followingId })
}

/**
 * 取消关注用户
 * @param followerId 关注者ID（当前用户）
 * @param followingId 被关注者ID
 * @returns 取消关注结果
 */
export const unfollowUser = (followerId: number, followingId: number): Promise<any> => {
  return request.delete(`/api/follows?followerId=${followerId}&followingId=${followingId}`)
}

// 获取评论树
export const getCommentTree = (videoId: string | number) => {
  return request({
    url: `/api/comments/tree/${videoId}`,
    method: 'get'
  })
}

// 点赞评论
export const likeComment = (commentId: string) => {
  return request({
    url: `/api/comments/${commentId}/like`,
    method: 'post'
  })
}

// 取消评论点赞
export const unlikeComment = (commentId: string) => {
  return request({
    url: `/api/comments/${commentId}/like`,
    method: 'delete'
  })
}

/**
 * 获取用户关注列表
 * @param userId 用户ID
 * @returns 关注用户列表
 */
export const getUserFollowing = (userId: number | string) => {
  return request({
    url: `/api/follows/following/${userId}`,
    method: 'get'
  })
}

/**
 * 创建评论
 */
export const createComment = (data: {
  userId: number
  videoId: number | string
  content: string
  replyToUserId: number
  mentionedUserIds: number[]
  parentId: number // 父评论ID，一级评论为0
}) => {
  return request({
    url: '/api/comments',
    method: 'post',
    data
  })
}
