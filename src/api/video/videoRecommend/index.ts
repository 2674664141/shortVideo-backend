
import request from '@/utils/request';
import type { Result, VideoVO } from '@/type/videoRecommend'; // 假设已定义类型

/**
 * 获取热门视频（baseHot）
 */
export const getBaseHotVideos = () => {
    return request.get<Result<VideoVO[]>>('/video-recommend/baseHot');
};

/**
 * 基于内容推荐（baseContent）
 * @param userId 用户 ID
 */
export const getBaseContentVideos = (userId: number) => {
    return request.get<Result<VideoVO[]>>('/video-recommend/baseContent', {
        params: { userId },
    });
};

/**
 * 基于用户行为推荐（baseUserBehavior）
 * @param userId 用户 ID
 * @param refresh 是否刷新
 */
export const getBaseUserBehaviorVideos = (userId: number, refresh: boolean) => {
    return request.get<Result<VideoVO[]>>('/video-recommend/baseUserBehavior', {
        params: { userId, refresh },
    });
};

/**
 * 获取视频详情
 * @param videoId 视频ID
 */
export const getVideoDetail = (videoId: string | number) => {
    return request.get<Result<VideoVO>>(`/video-recommend/getVideoDetail/${videoId}`);
};
