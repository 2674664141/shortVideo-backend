// 全局类型定义文件

export interface AppState {}

export interface TouGaoState {
  videoInfo: VideoInfo
  uploadInfo: UploadInfo
}

export interface HomeState {
  showLoginModal: boolean
  jingxuanVideoList: VideoVO[]
  theme: string
}

export interface VideoInfo {
  video?: File
  videoUrl: string
  videoName: string
  videoTitle: string
  videoCover: string
  videoType: number
  videoCategory: string
  videoCategoryId: number
  videoDesc: string
  videoDuration: number
  videoTag: string[]
}

export interface VideoDTO {
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  duration: number
  categoryId: number
  tags: string
  status: number
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  createdTime?: Date
  updatedTime?: Date
}

export interface VideoVO {
  id: number
  userId: number
  author: string
  avatar: string
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  duration: number
  categoryId: number
  tags: string
  status: number
  viewCount: number
  likeCount: number
  playCount: number
  favoriteCount: number
  commentCount: number
  shareCount: number
  createdTime?: Date
  updatedTime?: Date
}

export interface UploadInfo {
  total: number
  current: number
  progress: number
  completed: boolean
}

export interface ChunkObject {
  blob: Blob
  index: number
  hash: string
  start?: number
  end?: number
}

export const ApiStatus = {
  success: 200, // 成功
  error: 400, // 错误
  unauthorized: 401, // 未授权
  forbidden: 403, // 禁止访问
  notFound: 404, // 未找到
  methodNotAllowed: 405, // 方法不允许
  requestTimeout: 408, // 请求超时
  internalServerError: 500, // 服务器错误
  notImplemented: 501, // 未实现
  badGateway: 502, // 网关错误
  serviceUnavailable: 503, // 服务不可用
  gatewayTimeout: 504, // 网关超时
  httpVersionNotSupported: 505 // HTTP版本不支持
} as const
