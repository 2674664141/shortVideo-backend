// 视频相关类型定义

// 视频详情数据
export interface VideoDetail {
    id: number
    userId: number
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
    favoriteCount: number
    createdTime: number
    updatedTime: number
  }
  
  // 视频详情API响应
  export interface VideoDetailResponse {
    code: number
    data: VideoDetail
    message: string
  }
  
  // 视频详情展示数据（处理后的数据）
  export interface VideoDisplayInfo {
    id: number
    userId: number
    title: string
    description: string
    userAvatar: string
    userName: string
    videoUrl: string
    coverUrl: string
    duration: string // 格式化后的时长
    categoryId: number
    status: number
    tags: string[]
    views: string // 格式化后的观看次数
    viewCount: number // 原始观看次数
    date: string // 格式化后的日期
    createdTime: number // 原始创建时间
    updatedTime: number // 原始更新时间
    likes: number
    favorites: number // 收藏数
    comments: number // 评论数
    shares: number
  }
  
  // 收藏夹类型定义
  export interface FavoriteFolder {
    id: number
    userId: number
    folderName: string
    coverUrl: string | null
    isPrivate: number
    sortOrder: number
    createdTime: number
    updatedTime: number
  }
  
  // 收藏夹列表返回类型
  export interface FavoriteFoldersResponse {
    code: number
    data: FavoriteFolder[]
    message: string
  }
  
  // 收藏状态返回类型
  export interface FavoriteStatusResponse {
    code: number
    data: boolean
    message: string
  }
  
  // 创建收藏夹返回类型
  export interface CreateFolderResponse {
    code: number
    data: string
    message: string
  }

  // 评论树节点类型
  export interface CommentNode {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    avatar: string;
    region: string;
    content: string;
    likeCount: number;
    createdTime: string;
    children: CommentNode[];
  } 