export interface PlatformDataVO {
  totalPlayCount: number
  totalVideoCount: number
  totalLikeCount: number
  totalCommentCount: number
  totalShareCount: number
  totalFavoriteCount: number
  totalUserCount: number
  totalAuditCount: number
}

export interface DailyStatisticsVO {
  date: string
  playCount: number
  favoriteCount: number
  commentCount: number
  shareCount: number
  likeCount: number
  newUserCount: number
  videoCount: number
}
