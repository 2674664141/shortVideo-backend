export interface FollowVO {
  id: number
  followerId: number
  followingId: number
  followerName: string
  followingName: string
  followerAvatar: string
  followingAvatar: string
  followerSignature: string
  followingSignature: string
  createdTime: string
  isMutualFollow: boolean
}
