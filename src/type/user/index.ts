export interface UserState {
  token: string
  userInfo?: UserInfo
}

export interface LoginForm {
  account: string
  password: string
}

export interface RegisterForm {
  userName: string
  password: string
  repeatPassword: string
  phone: string
  phoneCode: string
}

export interface UserInfo {
  avatar: string
  birthday: string
  createdTime: string
  email: string
  emialVerified: number
  gender: number
  id: string
  nickname: string
  phone: string
  phoneVerified: number
  region: string
  signature: string
  status: number
  updatedTime: string
  userName: string
  userProfile: UserProfile
  userPrivacy: UserPrivacy
}

export interface UserProfile {
  commentCount: number
  followerCount: number
  followingCount: number
  id: string
  idCard: string
  isVerified: number
  level: number
  likeCount: number
  realName: string
  shareCount: number
  userId: string
  verifyTime: string
  videoCount: number
  viewCount: number
}

export interface UserPrivacy {
  accountPublic: number
  allowComment: number
  allowDownload: number
  allowMessage: number
  id: string
  showViewHistory: number
  userId: string
}
