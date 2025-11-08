/**
 * 视频相关工具函数
 */

/**
 * 格式化数字
 * @param num 数字
 * @returns 格式化后的数字字符串，超过10000显示为x.x万
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
};

/**
 * 格式化时间戳为日期字符串
 * @param timestamp 时间戳
 * @returns 格式化的日期字符串 YYYY-MM-DD
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 格式化秒数为分:秒格式
 * @param seconds 秒数
 * @returns 格式化的时间字符串 MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 将API返回的视频数据转换为页面显示需要的格式
 * @param videoData API返回的原始视频数据
 * @returns 处理后的视频显示数据
 */
export const transformVideoData = (videoData: any) => {
  return {
    // 保留原始字段
    id: videoData.id,
    userId: videoData.userId,
    title: videoData.title,
    description: videoData.description,
    videoUrl: videoData.videoUrl,
    coverUrl: videoData.coverUrl,
    categoryId: videoData.categoryId,
    status: videoData.status,
    viewCount: videoData.viewCount,
    createdTime: videoData.createdTime,
    updatedTime: videoData.updatedTime,
    
    // 格式化的字段
    duration: formatDuration(videoData.duration),
    views: formatNumber(videoData.viewCount),
    date: formatDate(videoData.createdTime),
    
    // 交互数据
    likes: videoData.likeCount,
    favorites: videoData.favoriteCount,
    comments: videoData.commentCount,
    shares: videoData.shareCount,
    
    // 处理标签
    tags: videoData.tags ? videoData.tags.split(',') : []
  };
}; 