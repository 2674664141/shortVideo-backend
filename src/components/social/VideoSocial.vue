<template>
  <div class="social-container">
    <!-- 右侧互动按钮 -->
    <div class="interaction-buttons" :class="{ 'shifted-left': showComments }">
      <!-- 用户头像 -->
      <div class="avatar-container">
        <el-avatar :size="60" :src="videoData.userAvatar" />
        <div class="follow-button" @click="handleFollow">
          <el-button :type="isFollowing ? 'success' : 'danger'" circle size="small">
            <i :class="isFollowing ? 'ri-check-line' : 'ri-add-line'"></i>
          </el-button>
        </div>
      </div>

      <!-- 点赞按钮 -->
      <div class="action-item">
        <el-popover
          placement="left"
          trigger="hover"
          :width="100"
          popper-class="custom-popover like-popover"
        >
          <template #default>
            <div class="tip-content">
              <span class="tip-text">{{ isLiked ? '取消点赞' : '点赞' }}</span>
              <span class="tip-icon">Z</span>
            </div>
          </template>
          <template #reference>
            <el-button class="action-button" :class="{ liked: isLiked }" circle @click="toggleLike">
              <i class="ri-heart-fill"></i>
            </el-button>
          </template>
        </el-popover>
        <span class="action-count">{{ formatCount(videoData.likes) }}</span>
      </div>

      <!-- 评论按钮 -->
      <div class="action-item">
        <el-popover
          placement="left"
          trigger="hover"
          :width="100"
          popper-class="custom-popover comment-popover"
        >
          <template #default>
            <div class="tip-content">
              <span class="tip-text">评论</span>
              <span class="tip-icon">C</span>
            </div>
          </template>
          <template #reference>
            <el-button class="action-button" circle @click="toggleComments(true)">
              <i class="ri-chat-1-fill"></i>
            </el-button>
          </template>
        </el-popover>
        <span class="action-count">{{ videoData.comments }}</span>
      </div>

      <!-- 收藏按钮 -->
      <div class="action-item">
        <el-popover
          placement="left"
          trigger="hover"
          :width="100"
          popper-class="custom-popover collection-popover"
        >
          <template #default>
            <div class="tip-content">
              <span class="tip-text">{{ isFavorite ? '取消收藏' : '收藏' }}</span>
              <span class="tip-icon">S</span>
            </div>
          </template>
          <template #reference>
            <el-button
              class="action-button"
              :class="{ favorited: isFavorite }"
              circle
              @click="toggleFavorite"
            >
              <i class="ri-star-fill"></i>
            </el-button>
          </template>
        </el-popover>
        <span class="action-count">{{ formatCount(videoData.favorites) }}</span>
      </div>

      <!-- 分享按钮 -->
      <div class="action-item">
        <el-popover
          placement="left"
          trigger="hover"
          :width="380"
          popper-class="custom-popover share-popover"
        >
          <template #default>
            <div class="share-panel">
              <div class="search-wrapper">
                <div class="search-box">
                  <i class="ri-search-line"></i>
                  <input type="text" placeholder="搜索" />
                </div>
              </div>
              <div class="share-title">分享给朋友</div>
              <div class="share-list">
                <div
                  class="share-item"
                  v-for="friend in friendList"
                  :key="friend.id"
                  @click="shareToFriend(friend.id)"
                >
                  <img :src="friend.avatar" :alt="friend.name" class="share-avatar" />
                  <div class="share-info">
                    <div class="share-name">{{ friend.name }}</div>
                    <div v-if="friend.status" class="share-status">{{ friend.status }}</div>
                  </div>
                  <div class="share-btn">分享</div>
                </div>
              </div>
            </div>
          </template>
          <template #reference>
            <el-button class="action-button" circle @click="handleShare">
              <i class="ri-share-forward-fill"></i>
            </el-button>
          </template>
        </el-popover>
        <span class="action-count">{{ videoData.shares }}</span>
      </div>
    </div>

    <!-- 右侧弹出评论面板 -->
    <div class="comment-drawer" :class="{ 'comment-drawer-visible': showComments }">
      <div class="comment-panel">
        <div class="comment-header">
          <div class="comment-title">
            <span>评论</span>
            <span class="comment-count">({{ videoData.comments }})</span>
          </div>
          <div class="close-btn" @click.stop="toggleComments(false)">
            <i class="ri-close-line"></i>
          </div>
        </div>
        <div class="comment-tabs">
          <div class="tab-item active">TA的作品</div>
          <div class="tab-item">评论</div>
          <div class="tab-item">相关推荐</div>
        </div>
        <div class="comment-list">
          <div class="comment-item" v-for="comment in commentList" :key="comment.id">
            <img
              :src="comment.avatar"
              :alt="comment.nickname"
              class="comment-avatar"
              @error="(e) => handleAvatarError(e, 'comment')"
            />
            <div class="comment-content">
              <div class="comment-info">
                <span class="comment-username">{{ comment.nickname }}</span>
                <span class="comment-location" v-if="comment.region">{{ comment.region }}</span>
              </div>
              <div class="comment-text" v-html="comment.content"></div>
              <div class="comment-meta">
                <span class="comment-time">{{ comment.createdTime }}</span>
                <div class="comment-actions">
                  <span class="action-btn" @click="handleReplyClick(comment)">
                    <i class="ri-reply-line"></i>
                    回复
                  </span>
                  <span
                    class="action-btn"
                    :class="{ liked: likedCommentIds.has(comment.id) }"
                    @click="handleCommentLike(comment)"
                  >
                    <i
                      :class="likedCommentIds.has(comment.id) ? 'ri-heart-fill' : 'ri-heart-line'"
                    ></i>
                    {{ comment.likeCount }}
                  </span>
                </div>
              </div>
              <!-- 渲染子评论 -->
              <div class="comment-replies" v-if="comment.children && comment.children.length > 0">
                <div
                  class="comment-item reply-item"
                  v-for="reply in comment.children"
                  :key="reply.id"
                >
                  <img
                    :src="reply.avatar"
                    :alt="reply.nickname"
                    class="comment-avatar"
                    @error="(e) => handleAvatarError(e, 'reply')"
                  />
                  <div class="comment-content">
                    <div class="comment-info">
                      <span class="comment-username">{{ reply.nickname }}</span>
                      <span class="comment-location" v-if="reply.region">{{ reply.region }}</span>
                    </div>
                    <div class="comment-text" v-html="reply.content"></div>
                    <div class="comment-meta">
                      <span class="comment-time">{{ reply.createdTime }}</span>
                      <div class="comment-actions">
                        <span class="action-btn" @click="handleReplyClick(reply)">
                          <i class="ri-reply-line"></i>
                          回复
                        </span>
                        <span
                          class="action-btn"
                          :class="{ liked: likedCommentIds.has(reply.id) }"
                          @click="handleCommentLike(reply)"
                        >
                          <i
                            :class="
                              likedCommentIds.has(reply.id) ? 'ri-heart-fill' : 'ri-heart-line'
                            "
                          ></i>
                          {{ reply.likeCount }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论输入框 -->
    <div class="comment-input" :class="{ 'input-visible': showComments }">
      <div class="input-container">
        <input
          type="text"
          placeholder="留下你的精彩评论吧"
          v-model="commentText"
          ref="commentInputRef"
        />
        <button class="send-button" @click="handleSendComment">
          <i class="ri-arrow-up-line"></i>
        </button>
      </div>
      <div class="action-bar">
        <div class="action-icon">
          <i class="ri-image-line"></i>
        </div>
        <div class="action-icon">
          <button @click.prevent.stop="handleAtButtonClick" class="icon-button">
            <i class="ri-at-line"></i>
          </button>
        </div>
        <div class="action-icon">
          <button @click.prevent.stop="handleEmojiButtonClick" class="icon-button">
            <i class="ri-emotion-line"></i>
          </button>
        </div>
      </div>

      <!-- @ 用户面板 -->
      <div class="at-panel" v-if="showAtPanel" ref="atPanelRef" @click.stop>
        <div class="at-header">
          <div class="at-title">选择要@的人</div>
          <div class="close-btn" @click="closeAtPanel">
            <i class="ri-close-line"></i>
          </div>
        </div>
        <div class="search-wrapper">
          <div class="search-box">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="搜索" v-model="atSearchKeyword" />
          </div>
        </div>
        <div class="at-list">
          <!-- 加载状态 -->
          <div v-if="followingUsersLoading" class="at-loading">
            <i class="el-icon-loading"></i>
            <p>加载中...</p>
          </div>

          <!-- 有数据显示网格 -->
          <div v-else-if="followingUsers.length > 0" class="at-grid">
            <div
              class="at-item"
              v-for="user in filteredFollowingUsers"
              :key="user.id"
              @click="selectAtUser(user)"
            >
              <div class="at-avatar-container">
                <img
                  :src="user.avatar"
                  :alt="user.nickname"
                  class="at-avatar"
                  @error="(e) => handleAvatarError(e, 'at')"
                />
              </div>
              <div class="at-name">{{ user.nickname }}</div>
            </div>
          </div>

          <!-- 搜索无结果 -->
          <div v-else-if="atSearchKeyword && filteredFollowingUsers.length === 0" class="at-empty">
            没有找到匹配的用户
          </div>

          <!-- 无关注用户 -->
          <div v-else class="at-empty">
            暂无关注用户
            <p class="at-empty-tip">去关注感兴趣的人吧</p>
          </div>
        </div>
      </div>

      <!-- 表情包面板 -->
      <div class="emoji-panel" v-if="showEmojiPanel" ref="emojiPanelRef" @click.stop>
        <div class="emoji-header">
          <div class="emoji-title">选择表情</div>
          <div class="close-btn" @click="closeEmojiPanel">
            <i class="ri-close-line"></i>
          </div>
        </div>
        <div class="emoji-search-wrapper">
          <div class="emoji-search-box">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="搜索表情" v-model="emojiSearchKeyword" />
          </div>
        </div>
        <div class="emoji-list">
          <div class="emoji-grid">
            <div
              class="emoji-item"
              v-for="emoji in filteredEmojiList"
              :key="emoji.id"
              @click="selectEmoji(emoji)"
            >
              <div class="emoji-avatar-container">
                <img
                  :src="`${EMOJI_BASE_PATH}${emoji.file}`"
                  :alt="emoji.name"
                  class="emoji-avatar"
                  @error="handleEmojiError($event, emoji)"
                />
              </div>
            </div>
          </div>
          <div v-if="filteredEmojiList.length === 0" class="emoji-empty">没有找到匹配的表情</div>
          <div v-if="emojiLoadErrors.length > 0" class="emoji-error">
            <p>部分表情加载失败，请检查路径：</p>
            <div v-for="(error, index) in emojiLoadErrors" :key="index" class="emoji-error-item">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收藏夹选择对话框 -->
    <el-dialog
      v-model="showFavoriteFolderDialog"
      title="选择收藏夹"
      width="400px"
      destroy-on-close
      append-to-body
      :modal="true"
      :close-on-click-modal="false"
      @click.stop
    >
      <div class="folder-dialog-content" @click.stop>
        <div class="folder-list">
          <div v-for="folder in favoriteFolders" :key="folder.id" class="folder-item">
            <div class="folder-info">
              <div class="folder-avatar">
                <img
                  v-if="folder.coverUrl"
                  :src="processImageUrl(folder.coverUrl)"
                  alt="封面"
                  @error="(e) => handleImageError(e, folder)"
                />
                <div v-else class="folder-avatar-placeholder">
                  {{ folder.folderName.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="folder-name">
                {{ folder.folderName }}
                <span v-if="folder.videoCount > 0">{{ folder.videoCount }}</span>
              </div>
            </div>
            <el-checkbox v-model="folder.selected" @change="toggleFolderSelection(folder.id)" />
          </div>
        </div>

        <div class="new-folder-btn" @click.stop.prevent="toggleNewFolderInput">
          <i class="el-icon-plus"></i>
          <span>新建</span>
        </div>

        <!-- 新建收藏夹输入框 -->
        <div v-if="showNewFolderInput" class="new-folder-input" @click.stop>
          <el-input
            v-model="newFolderName"
            placeholder="请输入收藏夹名称"
            size="small"
            @keyup.enter.stop.prevent="handleCreateFolder"
          >
            <template #append>
              <el-button @click.stop.prevent="handleCreateFolder">创建</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer" @click.stop>
          <el-button class="folder-btn only-save" @click.stop.prevent="handleOnlySaveVideo"
            >仅收藏视频</el-button
          >
          <el-button
            class="folder-btn save-to-folder"
            type="primary"
            @click.stop.prevent="handleAddToFavorites"
            >收藏至收藏夹</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, watch, defineEmits, computed } from 'vue'
import { ElMessage } from 'element-plus'
import 'remixicon/fonts/remixicon.css'
import {
  getVideoDetail,
  checkVideoLike,
  likeVideo,
  unlikeVideo,
  checkVideoFavorite,
  getFavoriteFolders,
  createFavoriteFolder,
  addVideoToFavorites,
  removeVideoFromFavorites,
  checkFollowStatus,
  followUser,
  unfollowUser,
  getCommentTree,
  likeComment,
  unlikeComment,
  getUserFollowing,
  createComment
} from '@/api/social'
import { formatNumber, formatDuration, formatDate, transformVideoData } from '@/utils/socialUtils'
import type { VideoDisplayInfo, FavoriteFolder, CommentNode } from '@/type/social'
import { EMOJI_LIST, EMOJI_BASE_PATH } from '@/constant/social'

const props = defineProps({
  videoId: {
    type: [Number, String],
    default: 1
  }
})

const emit = defineEmits(['commentVisibleChange'])

// 状态变量
const showComments = ref(false)
const videoData = ref<VideoDisplayInfo>({
  id: 1,
  userId: 0,
  title: '',
  description: '',
  videoUrl: '',
  coverUrl: '',
  duration: '',
  categoryId: 0,
  status: 0,
  tags: [],
  views: '',
  viewCount: 0,
  date: '',
  createdTime: 0,
  updatedTime: 0,
  userAvatar: 'https://example.com/avatar.jpg',
  userName: '用户',
  // postTime: '刚刚',
  likes: 0,
  comments: 0,
  favorites: 0,
  shares: 0
})

// 用户ID，实际应用中应该从用户状态或登录信息中获取
const userId = ref(2)

// 点赞和收藏状态
const isLiked = ref(false)
const isFavorite = ref(false)

// 收藏夹相关状态
const favoriteFolders = ref<FavoriteFolder[]>([])
const selectedFolders = ref<number[]>([])
const showNewFolderInput = ref(false)
const newFolderName = ref('')
const showFavoriteFolderDialog = ref(false)

// 在状态变量部分添加
const isFollowing = ref(false)

// 计算是否有选中的收藏夹
const hasSelectedFolders = computed(() => {
  return selectedFolders.value.length > 0
})

// 格式化数字
const formatCount = (count: number) => {
  return formatNumber(count)
}

// 模拟好友列表数据
const friendList = ref([
  {
    id: 1,
    name: '龙井',
    avatar: 'https://example.com/avatar1.jpg'
  },
  {
    id: 2,
    name: '想和小张一起喝奶茶',
    avatar: 'https://example.com/avatar2.jpg',
    status: '重燃中'
  },
  {
    id: 3,
    name: '怎配挥落雪',
    avatar: 'https://example.com/avatar3.jpg'
  },
  {
    id: 4,
    name: '',
    avatar: 'https://example.com/avatar4.jpg',
    status: '2小时前在线'
  },
  {
    id: 5,
    name: '宇宙无敌超A猛男',
    avatar: 'https://example.com/avatar5.jpg'
  }
])

// 评论数据
const commentList = ref<CommentNode[]>([])

// 记录已点赞的评论ID
const likedCommentIds = ref<Set<string>>(new Set())

// 评论相关状态
const commentText = ref('')
const mentionedUsers = ref<{ id: number; nickname: string }[]>([])
const replyToUserId = ref(0)
const parentId = ref(0) // 父评论ID，一级评论为0
const selectedEmojis = ref<{ name: string; file: string }[]>([])

// @ 功能相关
const showAtPanel = ref(false)
const atSearchKeyword = ref('')
const commentInputRef = ref(null)
const atPanelRef = ref(null)

// 表情包功能相关
const showEmojiPanel = ref(false)
const emojiSearchKeyword = ref('')
const emojiPanelRef = ref(null)
const emojiList = ref(EMOJI_LIST)
const emojiLoadErrors = ref([])

// 关注的用户列表
const followingUsers = ref([])
const followingUsersLoading = ref(false)

// 过滤关注用户列表
const filteredFollowingUsers = computed(() => {
  if (!atSearchKeyword.value) return followingUsers.value
  return followingUsers.value.filter((user) =>
    user.nickname.toLowerCase().includes(atSearchKeyword.value.toLowerCase())
  )
})

// 过滤表情包列表
const filteredEmojiList = computed(() => {
  if (!emojiSearchKeyword.value) return emojiList.value
  return emojiList.value.filter((emoji) =>
    emoji.name.toLowerCase().includes(emojiSearchKeyword.value.toLowerCase())
  )
})

// 获取关注用户列表
const fetchFollowingUsers = async () => {
  if (followingUsers.value.length > 0) {
    // 如果已经加载过关注用户，则不重复加载
    return
  }

  followingUsersLoading.value = true
  try {
    const response = await getUserFollowing(userId.value)
    if (response && response.data && response.data.code === 200) {
      console.log('获取关注用户列表成功:', response.data)
      followingUsers.value = response.data.data || []

      if (followingUsers.value.length === 0) {
        console.warn('获取到的关注用户列表为空')
      }
    } else {
      console.error('获取关注用户列表失败:', response)
      ElMessage({
        message: response?.data?.message || '获取关注用户列表失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('获取关注用户列表出错:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  } finally {
    followingUsersLoading.value = false
  }
}

// 获取评论数据
const fetchComments = async () => {
  try {
    const response = await getCommentTree(props.videoId)
    if (response && response.data && response.data.code === 200) {
      console.log('获取评论数据API响应:', response)
      // 处理评论内容，确保图片路径正确
      const processedComments = processComments(response.data.data)
      commentList.value = processedComments
    } else {
      ElMessage({
        message: '获取评论失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 处理评论内容，确保图片路径正确
const processComments = (comments: CommentNode[]): CommentNode[] => {
  return comments.map((comment) => {
    // 复制评论对象，避免直接修改原对象
    const processedComment = { ...comment }

    // 处理评论图片路径
    if (processedComment.content) {
      // 确保图片路径正确，加上onerror处理
      processedComment.content = processedComment.content.replace(
        /<img([^>]*)src="([^"]*)"([^>]*)>/gi,
        '<img$1src="$2" onerror="this.style.display=\'none\'" onload="this.style.display=\'inline-block\'"$3>'
      )
    }

    // 递归处理子评论
    if (processedComment.children && processedComment.children.length > 0) {
      processedComment.children = processComments(processedComment.children)
    }

    return processedComment
  })
}

// 处理图片URL
const processImageUrl = (url: string) => {
  if (!url) return ''

  // 检查URL是否已经是完整的URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 如果是相对路径，添加基础URL
  // 注意：在实际部署时可能需要修改这里的基础URL
  return url.startsWith('/') ? url : `/${url}`
}

// 处理图片加载错误
const handleImageError = (event: Event, folder: any) => {
  console.log('图片加载失败:', folder.coverUrl)
  // 设置为默认封面
  folder.coverUrl = null
}

// 初始化每个收藏夹的选中状态
const initFolders = (folders) => {
  return folders.map((folder) => ({
    ...folder,
    selected: false,
    videoCount: folder.videoCount || 0,
    coverUrl: folder.coverUrl || null // 确保即使coverUrl为空字符串也设为null
  }))
}

// 获取视频详情
const fetchVideoData = async () => {
  try {
    const response = await getVideoDetail(props.videoId)
    if (response && response.data && response.data.code === 200) {
      console.log('视频详情API响应:', response)
      // 使用transformVideoData转换数据
      videoData.value = transformVideoData(response.data.data)

      // 获取点赞和收藏状态
      await checkLikeStatus()
      await checkFavoriteStatus()
      await checkIsFollowing()
    } else {
      ElMessage({
        message: '获取视频详情失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('获取视频数据失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 检查用户是否已点赞该视频
const checkLikeStatus = async () => {
  try {
    const response = await checkVideoLike(userId.value, videoData.value.id)
    if (response && response.data && response.data.code === 200) {
      isLiked.value = response.data.data
      console.log('检查用户是否已点赞该视频API响应:', response)
    } else {
      console.error('检查点赞状态失败:', response?.message || '未知错误')
    }
  } catch (error) {
    console.error('检查点赞状态失败:', error)
  }
}

// 检查用户是否已收藏该视频
const checkFavoriteStatus = async () => {
  try {
    const response = await checkVideoFavorite(userId.value, videoData.value.id)
    if (response && response.data && response.data.code === 200) {
      console.log('检查用户是否已收藏该视频API响应:', response)
      isFavorite.value = response.data.data
    } else {
      console.error('检查收藏状态失败:', response?.message || '未知错误')
    }
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

// 检查关注状态
const checkIsFollowing = async () => {
  try {
    const response = await checkFollowStatus(userId.value, videoData.value.userId)
    if (response && response.data && response.data.code === 200) {
      console.log('检查关注状态API响应:', response)
      isFollowing.value = response.data.data
      console.log('检查关注状态API响应:', response)
    } else {
      console.error('检查关注状态失败:', response)
    }
  } catch (error) {
    console.error('检查关注状态失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 获取用户收藏夹列表
const fetchFavoriteFolders = async () => {
  try {
    const response = await getFavoriteFolders(userId.value)
    if (response && response.data && response.data.code === 200) {
      console.log('获取用户收藏夹列表API响应:', response)

      // 检查每个收藏夹的coverUrl
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data.forEach((folder, index) => {
          console.log(`收藏夹${index + 1} - ${folder.folderName}的封面URL:`, folder.coverUrl)
        })
      }

      favoriteFolders.value = initFolders(response.data.data)

      // 检查处理后的收藏夹数据
      favoriteFolders.value.forEach((folder, index) => {
        console.log(`处理后的收藏夹${index + 1}:`, {
          id: folder.id,
          name: folder.folderName,
          coverUrl: folder.coverUrl
        })
      })

      showFavoriteFolderDialog.value = true
    } else {
      ElMessage({
        message: '获取收藏夹列表失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('获取收藏夹列表失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 点赞功能
const toggleLike = async () => {
  try {
    let response
    if (isLiked.value) {
      // 如果已点赞，则发送取消点赞请求
      response = await unlikeVideo(userId.value, videoData.value.id)
      if (response && response.data && response.data.code === 200) {
        console.log('取消点赞功能API响应:', response)
        isLiked.value = false
        videoData.value.likes--
        ElMessage({
          message: '已取消点赞',
          type: 'info'
        })
      } else {
        ElMessage({
          message: response?.data?.message || '取消点赞失败',
          type: 'error'
        })
      }
    } else {
      // 如果未点赞，则发送点赞请求
      response = await likeVideo(userId.value, videoData.value.id)
      if (response && response.data && response.data.code === 200) {
        console.log('点赞功能API响应:', response)
        isLiked.value = true
        videoData.value.likes++
        ElMessage({
          message: '点赞成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: response?.data?.message || '点赞失败',
          type: 'error'
        })
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 收藏功能
const toggleFavorite = async () => {
  if (isFavorite.value) {
    // 如果已收藏，则发送取消收藏请求
    try {
      const response = await removeVideoFromFavorites(userId.value, videoData.value.id)
      if (response && response.data && response.data.code === 200) {
        console.log('取消收藏功能API响应:', response)
        isFavorite.value = false
        videoData.value.favorites--
        ElMessage({
          message: '已取消收藏',
          type: 'info'
        })
      } else {
        ElMessage({
          message: response?.data?.message || '取消收藏失败',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('取消收藏失败:', error)
      ElMessage({
        message: '网络错误，请稍后再试',
        type: 'error'
      })
    }
  } else {
    // 如果未收藏，则获取收藏夹列表
    await fetchFavoriteFolders()
  }
}

// 添加到收藏夹
const addToFavorites = async (type: 'video_only' | 'folder') => {
  if (type === 'folder' && selectedFolders.value.length === 0) {
    ElMessage({
      message: '请选择至少一个收藏夹',
      type: 'warning'
    })
    return
  }

  try {
    const folderIds = type === 'video_only' ? [] : selectedFolders.value

    const response = await addVideoToFavorites(userId.value, videoData.value.id, folderIds)
    if (response && response.data && response.data.code === 200) {
      console.log('收藏功能API响应:', response)
      isFavorite.value = true
      videoData.value.favorites++
      showFavoriteFolderDialog.value = false
      selectedFolders.value = []
      ElMessage({
        message: '收藏成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: response?.data?.message || '收藏失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('添加到收藏夹失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 分享功能
const handleShare = () => {
  try {
    // 复制视频链接到剪贴板
    const videoUrl = `${window.location.origin}/video/${videoData.value.id}`
    navigator.clipboard.writeText(videoUrl)

    // 增加分享数
    videoData.value.shares++

    ElMessage({
      message: '分享链接已复制到剪贴板',
      type: 'success'
    })
  } catch (error) {
    console.error('分享失败:', error)
    ElMessage({
      message: '分享失败，请稍后再试',
      type: 'error'
    })
  }
}

// 监听videoId的变化，重新获取数据
watch(
  () => props.videoId,
  () => {
    fetchVideoData()
    fetchComments()
  }
)

// 监听showComments的变化并触发事件
watch(showComments, (newValue) => {
  console.log('Comment panel visibility changed:', newValue)
  // 评论面板关闭时，也关闭@面板
  if (!newValue) {
    showAtPanel.value = false
  }
  emit('commentVisibleChange', newValue)
})

// 处理评论按钮点击
const toggleComments = (value: boolean) => {
  showComments.value = value
}

// 切换新建收藏夹输入框
const toggleNewFolderInput = (event: Event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  showNewFolderInput.value = !showNewFolderInput.value
  console.log('切换新建收藏夹输入框:', showNewFolderInput.value)
}

// 处理创建收藏夹
const handleCreateFolder = async (event: Event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }

  console.log('开始创建收藏夹...')
  if (!newFolderName.value.trim()) {
    ElMessage({
      message: '收藏夹名称不能为空',
      type: 'warning'
    })
    return
  }

  try {
    const response = await createFavoriteFolder(userId.value, newFolderName.value.trim())
    if (response && response.data && response.data.code === 200) {
      console.log('创建新收藏夹API响应:', response)
      ElMessage({
        message: '创建收藏夹成功',
        type: 'success'
      })
      // 创建成功后，重新获取收藏夹列表
      newFolderName.value = ''
      showNewFolderInput.value = false
      await fetchFavoriteFolders()
    } else {
      ElMessage({
        message: response?.data?.message || '创建收藏夹失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error('创建收藏夹失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 处理关闭对话框
const handleCloseDialog = (event: Event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  console.log('关闭收藏夹对话框')
  showFavoriteFolderDialog.value = false
  selectedFolders.value = []
  showNewFolderInput.value = false
  newFolderName.value = ''
}

// 处理添加到收藏夹
const handleAddToFavorites = async (event: Event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  console.log('添加到收藏夹...')

  if (selectedFolders.value.length === 0) {
    ElMessage({
      message: '请选择至少一个收藏夹',
      type: 'warning'
    })
    return
  }

  await addToFavorites('folder')
}

// 分享给好友
const shareToFriend = (friendId: number) => {
  try {
    const friend = friendList.value.find((f) => f.id === friendId)
    if (friend) {
      // 在实际应用中，这里应该调用API发送分享消息给好友
      // 例如: await shareApi.shareToFriend(userId.value, friendId, videoData.value.id)

      // 增加分享数
      videoData.value.shares++

      ElMessage({
        message: `已分享给 ${friend.name}`,
        type: 'success'
      })
    } else {
      ElMessage({
        message: '找不到该好友',
        type: 'warning'
      })
    }
  } catch (error) {
    console.error('分享给好友失败:', error)
    ElMessage({
      message: '分享失败，请稍后再试',
      type: 'error'
    })
  }
}

// 处理收藏夹选择
const toggleFolderSelection = (folderId) => {
  const folder = favoriteFolders.value.find((f) => f.id === folderId)
  if (folder) {
    folder.selected = !folder.selected
    selectedFolders.value = favoriteFolders.value.filter((f) => f.selected).map((f) => f.id)
  }
}

// 处理仅收藏视频
const handleOnlySaveVideo = async () => {
  await addToFavorites('video_only')
}

// 处理关注/取消关注
const handleFollow = async () => {
  try {
    let response
    if (isFollowing.value) {
      // 取消关注
      response = await unfollowUser(userId.value, videoData.value.userId)
      if (response && response.data && response.data.code === 200) {
        console.log('取消关注API响应:', response)
        isFollowing.value = false
        ElMessage({
          message: '取消关注成功',
          type: 'success'
        })
      }
    } else {
      // 关注
      response = await followUser(userId.value, videoData.value.userId)
      if (response && response.data && response.data.code === 200) {
        console.log('关注API响应:', response)
        isFollowing.value = true
        ElMessage({
          message: '关注成功',
          type: 'success'
        })
      }
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 处理评论点赞
const handleCommentLike = async (comment: CommentNode) => {
  try {
    const isLiked = likedCommentIds.value.has(comment.id)
    const response = await (isLiked ? unlikeComment(comment.id) : likeComment(comment.id))

    if (response && response.data && response.data.code === 200) {
      if (isLiked) {
        likedCommentIds.value.delete(comment.id)
        comment.likeCount--
        ElMessage({
          message: '已取消点赞',
          type: 'info'
        })
      } else {
        likedCommentIds.value.add(comment.id)
        comment.likeCount++
        ElMessage({
          message: '点赞成功',
          type: 'success'
        })
      }
    } else {
      ElMessage({
        message: response?.data?.message || (isLiked ? '取消点赞失败' : '点赞失败'),
        type: 'error'
      })
    }
  } catch (error) {
    console.error('评论点赞操作失败:', error)
    ElMessage({
      message: '网络错误，请稍后再试',
      type: 'error'
    })
  }
}

// 添加头像错误处理函数
const handleAvatarError = (e: Event, type: string) => {
  const target = e.target as HTMLImageElement
  console.log(`${type} 头像加载失败:`, target.src)
  // 设置默认头像
  target.src = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}

// 处理@ 按钮点击
const handleAtButtonClick = async (event) => {
  console.log('At button clicked')
  // 防止事件冒泡
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 确保评论面板已显示
  if (!showComments.value) {
    console.log('Comment panel not visible, showing it first')
    toggleComments(true)
    // 给评论面板一点时间显示
    setTimeout(async () => {
      // 加载关注用户列表
      await fetchFollowingUsers()
      showAtPanel.value = true
      console.log('At panel visibility set to:', showAtPanel.value)
    }, 50)
  } else {
    // 如果面板要显示且数据还未加载，先加载数据
    if (!showAtPanel.value) {
      await fetchFollowingUsers()
    }
    // 直接切换@面板显示状态
    showAtPanel.value = !showAtPanel.value
    console.log('At panel visibility toggled to:', showAtPanel.value)
  }
}

// 关闭@面板
const closeAtPanel = () => {
  console.log('Closing at panel')
  showAtPanel.value = false
}

// 选择要 @ 的用户
const selectAtUser = (user) => {
  console.log('User selected:', user.nickname)

  // 记录被@用户
  const existingUser = mentionedUsers.value.find((u) => u.id === user.id)
  if (!existingUser) {
    mentionedUsers.value.push({
      id: user.id,
      nickname: user.nickname
    })
  }

  // 在评论文本中插入@用户名
  commentText.value += `@${user.nickname} `
  showAtPanel.value = false

  // 聚焦到输入框
  if (commentInputRef.value) {
    commentInputRef.value.focus()
  }
}

// 处理表情包按钮点击
const handleEmojiButtonClick = (event) => {
  console.log('Emoji button clicked')
  // 防止事件冒泡
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 确保评论面板已显示
  if (!showComments.value) {
    console.log('Comment panel not visible, showing it first')
    toggleComments(true)
    // 给评论面板一点时间显示
    setTimeout(() => {
      showEmojiPanel.value = true
      console.log('Emoji panel visibility set to:', showEmojiPanel.value)
    }, 50)
  } else {
    // 如果@面板已显示，先隐藏它
    if (showAtPanel.value) {
      showAtPanel.value = false
    }

    // 切换表情面板显示状态
    showEmojiPanel.value = !showEmojiPanel.value
    console.log('Emoji panel visibility toggled to:', showEmojiPanel.value)
  }
}

// 关闭表情面板
const closeEmojiPanel = () => {
  console.log('Closing emoji panel')
  showEmojiPanel.value = false
}

// 选择表情包
const selectEmoji = (emoji) => {
  console.log('Emoji selected:', emoji.name)

  // 记录选择的表情
  selectedEmojis.value.push({
    name: emoji.name,
    file: emoji.file
  })

  // 在输入框中显示表情标记
  commentText.value += `[表情:${emoji.file}]`

  // 关闭表情面板
  showEmojiPanel.value = false

  // 聚焦到输入框
  if (commentInputRef.value) {
    commentInputRef.value.focus()
  }
}

// 样式元素引用
const styleElementRef = ref<HTMLStyleElement | null>(null)

// 在mounted中添加全局样式
onMounted(() => {
  fetchVideoData()
  fetchComments()

  // 先移除可能存在的样式
  const existingStyle = document.getElementById('video-social-dialog-style')
  if (existingStyle) {
    existingStyle.remove()
  }

  // 添加全局样式，确保对话框为黑色
  const styleElement = document.createElement('style')
  styleElement.id = 'video-social-dialog-style'
  styleElement.textContent = `
    .el-dialog {
      background-color: #1a1a1a !important;
      border-radius: 8px !important;
    }
    .el-dialog__header {
      background-color: #1a1a1a !important;
      border-bottom: 1px solid #333 !important;
    }
    .el-dialog__title {
      color: #fff !important;
    }
    .el-dialog__close {
      color: #fff !important;
    }
    .el-dialog__body {
      background-color: #1a1a1a !important;
      padding: 0 !important;
    }
    .el-dialog__footer {
      background-color: #1a1a1a !important;
      padding: 0 !important;
    }
    .el-overlay {
      background: rgba(0, 0, 0, 0.5) !important;
    }
    .el-input__inner {
      background-color: #333 !important;
      border-color: #444 !important;
      color: #fff !important;
    }
    .el-checkbox__inner {
      background-color: transparent !important;
      border-color: #666 !important;
    }
    .folder-dialog-content {
      background-color: #1a1a1a !important;
      color: #fff !important;
    }
    .folder-item {
      background-color: #1a1a1a !important;
      border-bottom: 1px solid #333 !important;
    }
    .new-folder-btn {
      color: #409EFF !important;
      background-color: #1a1a1a !important;
      padding: 12px 16px !important;
      border-bottom: 1px solid #333 !important;
    }
    .new-folder-input {
      background-color: #1a1a1a !important;
      padding: 12px 16px !important;
      border-bottom: 1px solid #333 !important;
    }
    .dialog-footer {
      background-color: #1a1a1a !important;
      padding: 12px 16px !important;
    }
    .only-save {
      background-color: #333 !important;
      color: #fff !important;
      border: none !important;
    }
    .save-to-folder {
      background-color: #e74c3c !important;
      border-color: #e74c3c !important;
      color: #fff !important;
    }
    .folder-avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      background-color: #409EFF;
      text-transform: uppercase;
    }
  `
  document.head.appendChild(styleElement)
  styleElementRef.value = styleElement

  // 添加全局点击事件监听
  document.addEventListener('click', (event) => {
    if (showAtPanel.value && atPanelRef.value && !atPanelRef.value.contains(event.target)) {
      console.log('Click outside at panel, closing it')
      showAtPanel.value = false
    }

    if (
      showEmojiPanel.value &&
      emojiPanelRef.value &&
      !emojiPanelRef.value.contains(event.target)
    ) {
      console.log('Click outside emoji panel, closing it')
      showEmojiPanel.value = false
    }
  })

  // 检查表情包路径是否正确
  console.log('表情包基础路径:', EMOJI_BASE_PATH)
  emojiList.value.forEach((emoji) => {
    console.log(`表情: ${emoji.name}, 路径: ${EMOJI_BASE_PATH}${emoji.file}`)
  })
})

// 组件卸载时移除样式
onBeforeUnmount(() => {
  if (styleElementRef.value) {
    styleElementRef.value.remove()
  }

  // 移除事件监听
  document.removeEventListener('click', () => {})
})

// 处理表情包加载错误
const handleEmojiError = (event, emoji) => {
  console.error(`表情加载失败: ${emoji.name}, 文件: ${emoji.file}`)
  emojiLoadErrors.value.push(`${emoji.name} (${EMOJI_BASE_PATH}${emoji.file})`)
  // 设置默认替代图像
  event.target.src = '/biaoqing/img1.png' // 尝试使用第一个表情作为替代
}

// 发送评论
const handleSendComment = async () => {
  // 移除输入框中的表情标记，仅用于判断是否有内容
  const textWithoutEmoji = commentText.value.replace(/\[表情:.*?\]/g, '').trim()

  if (!textWithoutEmoji && selectedEmojis.value.length === 0) {
    ElMessage.warning('评论内容不能为空')
    return
  }

  try {
    // 构建评论内容HTML
    let content = ''
    let text = commentText.value

    // 处理@用户
    mentionedUsers.value.forEach((user) => {
      const atMark = `@${user.nickname}`
      if (text.includes(atMark)) {
        // 添加@用户标签
        content += `<a>@${user.nickname}</a>`
        // 从文本中移除@标记
        text = text.replace(atMark, '')
      }
    })

    // 处理剩余文本(移除回复前缀和表情标记)
    const replyPattern = /回复@.*?:\s/
    text = text.replace(replyPattern, '').trim()

    // 移除文本中的表情标记
    text = text.replace(/\[表情:.*?\]/g, '').trim()

    // 添加正文内容
    if (text) {
      content += `<p>${text}</p>`
    }

    // 添加表情标签
    selectedEmojis.value.forEach((emoji) => {
      content += `<br><img src='${EMOJI_BASE_PATH}${emoji.file}'>`
    })

    // 创建评论请求数据
    const commentData = {
      userId: userId.value,
      videoId: props.videoId,
      content: content,
      replyToUserId: replyToUserId.value,
      mentionedUserIds: mentionedUsers.value.map((u) => u.id),
      parentId: parentId.value // 添加父评论ID
    }

    console.log('准备发送评论:', commentData)

    // 发送请求
    const response = await createComment(commentData)
    if (response && response.data && response.data.code === 200) {
      ElMessage.success('评论发送成功')

      // 清空输入和状态
      commentText.value = ''
      mentionedUsers.value = []
      replyToUserId.value = 0
      parentId.value = 0 // 重置父评论ID
      selectedEmojis.value = [] // 清空选择的表情

      // 刷新评论列表
      await fetchComments()

      // 更新视频评论数
      videoData.value.comments++
    } else {
      ElMessage.error(response?.data?.message || '评论发送失败')
    }
  } catch (error) {
    console.error('发送评论失败:', error)
    ElMessage.error('网络错误，请稍后重试')
  }
}

// 处理回复按钮点击
const handleReplyClick = (comment) => {
  // 设置回复的用户ID
  replyToUserId.value = comment.userId

  // 设置父评论ID
  parentId.value = comment.id

  // 确保评论面板打开
  showComments.value = true
  // 聚焦到输入框
  setTimeout(() => {
    if (commentInputRef.value) {
      commentInputRef.value.focus()
      // 在输入框添加提示
      commentText.value = `回复@${comment.nickname}: `
    }
  }, 100)
}
</script>

<style scoped lang="scss">
.social-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  pointer-events: none;

  /* 确保容器内的可交互元素可以响应事件 */
  button,
  a,
  .close-btn,
  .action-button,
  input,
  .comment-drawer,
  .interaction-buttons {
    pointer-events: auto;
  }
}

.interaction-buttons {
  position: fixed;
  right: 20px;
  bottom: 150px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 99;
  pointer-events: auto;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 当评论面板打开时的样式 */
.interaction-buttons.shifted-left {
  right: 420px; /* 略大于评论抽屉宽度，提供一些间距 */
}

.avatar-container {
  margin-bottom: 30px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.follow-button {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  :deep(.el-button) {
    width: 25px;
    height: 25px;
    padding: 0;
    font-size: 14px;
    background-color: #ff4757;
    border: 2px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #ff6b81;
    }

    &.el-button--success {
      background-color: var(--el-color-success);

      &:hover {
        background-color: var(--el-color-success-light-3);
      }
    }

    i {
      font-weight: bold;
      font-size: 12px;
    }
  }
}

.plus-button {
  background-color: #ff4757;
  border: 2px solid white;
  padding: 6px;
  color: white;

  &:hover {
    background-color: #ff6b81;
  }

  i {
    font-size: 16px;
  }
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.action-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 35px;
  padding: 8px;

  &:hover {
    background: transparent;
  }

  i {
    font-size: 28px;
  }

  &.liked {
    color: #ff4757;
  }

  &.favorited {
    color: #ffbb00;
  }
}

.action-count {
  color: white;
  font-size: 14px;
  margin-top: 4px;
}

.custom-popover {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  outline: none !important;
}

:deep(.el-popper) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
}

:deep(.el-popper.is-light) {
  background: transparent !important;
  border: none !important;
}

:deep(.el-popper__arrow) {
  display: none !important;
}

:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.5) !important;
}

.like-popover,
.comment-popover {
  border: none !important;
}

.tip-content {
  background-color: #33343f;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .tip-text {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  .tip-icon {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    margin-left: 8px;
  }
}

.collection-popover {
  border: none !important;
}

.collection-panel {
  background-color: #25262c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.collection-header {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #e6e6e6;
    font-size: 14px;
  }

  .new-collection {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #e6e6e6;
    font-size: 14px;
    cursor: pointer;

    i {
      font-size: 16px;
    }
  }
}

.collection-content {
  padding: 0 16px;
}

.collection-item {
  background-color: #2c2d33;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;

  .collection-avatar {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 12px;
  }

  .collection-name {
    flex: 1;
    color: #e6e6e6;
    font-size: 14px;
  }
}

.collection-actions {
  padding: 16px;
  display: flex;
  gap: 12px;

  .collection-btn {
    flex: 1;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;

    &.video-only {
      background: #33343f;
      color: #e6e6e6;
    }

    &.collect-to {
      background: #c25b5b;
      color: #e6e6e6;
    }
  }
}

.share-popover {
  border: none !important;
  transform: translateY(-120px) !important;
}

.share-panel {
  background-color: #25262c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
}

.search-wrapper {
  margin-bottom: 12px;
}

.search-box {
  background-color: #33343f;
  border-radius: 20px;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;

  i {
    color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
    margin-right: 8px;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: #e6e6e6;
    width: 100%;
    font-size: 14px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.share-title {
  color: #e6e6e6;
  font-size: 14px;
  margin-bottom: 12px;
}

.share-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-item {
  display: flex;
  align-items: center;

  .share-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .share-info {
    flex: 1;
  }

  .share-name {
    color: #e6e6e6;
    font-size: 14px;
  }

  .share-status {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    margin-top: 2px;
  }

  .share-btn {
    background-color: #ff4757;
    color: white;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
}

.comment-drawer {
  position: fixed;
  top: 0;
  right: -380px;
  width: 380px;
  height: 100%;
  background-color: #25262c;
  z-index: 100;
  overflow-y: auto;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);

  &.comment-drawer-visible {
    right: 0;
  }
}

.comment-panel {
  background-color: #25262c;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.comment-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background-color: #25262c;
  z-index: 102;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  .comment-title {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      color: #e6e6e6;
      font-size: 16px;
    }

    .comment-count {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
    }
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #e6e6e6;
    border-radius: 50%;
    z-index: 103;
    position: relative;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      transform: rotate(90deg);
    }

    i {
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.comment-tabs {
  display: flex;
  padding: 12px 16px;
  gap: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .tab-item {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    cursor: pointer;
    padding-bottom: 8px;
    position: relative;

    &.active {
      color: #ff4757;

      &::after {
        content: '';
        position: absolute;
        bottom: -9px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #ff4757;
      }
    }
  }
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 70px; /* 为固定底部的输入框留出空间 */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .comment-content {
    flex: 1;
  }

  .comment-info {
    margin-bottom: 4px;
  }

  .comment-username {
    color: #e6e6e6;
    font-size: 14px;
    font-weight: 500;
  }

  .comment-location {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    margin-left: 8px;
  }

  .comment-text {
    color: #e6e6e6;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
    word-break: break-word;

    :deep(a) {
      color: #409eff;
      text-decoration: none;
      margin: 0 2px;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100px;
      max-height: 100px;
      vertical-align: middle;
      margin: 4px 0;
      border-radius: 4px;
      display: inline-block;
      &[src$='.png'],
      &[src$='.jpg'],
      &[src$='.jpeg'],
      &[src$='.gif'] {
        // 确保图片正常显示
      }
      &::before {
        content: '表情';
        display: inline-block;
        font-size: 12px;
        color: #999;
        background-color: #f0f0f0;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }

    :deep(p) {
      margin: 4px 0;
      display: inline;
    }
  }

  .comment-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comment-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }

  .comment-actions {
    display: flex;
    gap: 16px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    i {
      font-size: 16px;
      transition: all 0.3s ease;
    }

    &:hover {
      color: #e6e6e6;
    }

    &.liked {
      color: #ff4757;

      i {
        color: #ff4757;
      }

      &:hover {
        color: #ff6b81;

        i {
          color: #ff6b81;
        }
      }
    }
  }
}

.comment-input {
  position: fixed;
  bottom: 0;
  right: -380px;
  width: 380px;
  padding: 0;
  background-color: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 101;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;

  &.input-visible {
    right: 0;
  }

  .input-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    position: relative;

    input {
      flex: 1;
      height: 36px;
      background-color: #2d2d2d;
      border: none;
      border-radius: 18px;
      color: #fff;
      padding: 0 15px;
      padding-right: 50px;
      font-size: 14px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &:focus {
        outline: none;
      }
    }

    .send-button {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #ff4757;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #ff6b81;
      }

      i {
        color: white;
        font-size: 18px;
      }
    }
  }

  .action-bar {
    display: flex;
    padding: 5px 15px 12px;

    .action-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 20px;

      i {
        color: rgba(255, 255, 255, 0.6);
        font-size: 20px;

        &:hover {
          color: #fff;
        }
      }

      &:last-child {
        margin-right: 0;
      }

      .icon-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:focus {
          outline: none;
        }
      }
    }
  }
}

.collection-new-input {
  padding: 12px 16px;
  position: relative;

  .cancel-btn {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      color: white;
    }
  }
}

.no-folders {
  padding: 16px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed !important;

  &:hover {
    background: #c25b5b !important;
  }
}

.favorite-folders-list {
  max-height: 300px;
  overflow-y: auto;
}

.favorite-folder-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.create-folder {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 0;
  color: #409eff;
}

.create-folder i {
  margin-right: 8px;
}

.new-folder-input {
  margin: 15px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 确保外部容器不影响整体布局 */
:deep(.el-dialog) {
  background-color: #25262c;
  border-radius: 12px;
}

:deep(.el-dialog__title) {
  color: #e6e6e6;
}

:deep(.el-dialog__body) {
  color: #e6e6e6;
}

:deep(.el-checkbox) {
  color: #e6e6e6;
}

:deep(.el-button) {
  border-radius: 4px;
}

/* 收藏夹对话框样式 */
.folder-dialog-content {
  background-color: #1a1a1a !important;
  color: #fff !important;
  padding: 0 !important;
}

.folder-list {
  max-height: 300px;
  overflow-y: auto;
  background-color: #1a1a1a !important;
}

.folder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #333 !important;
  background-color: #1a1a1a !important;
}

.folder-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.folder-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  background-color: #333 !important;
}

.folder-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.folder-name {
  font-size: 14px;
  color: #fff !important;
}

.new-folder-btn {
  padding: 12px 16px;
  color: #409eff !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: #1a1a1a !important;
  border-bottom: 1px solid #333 !important;
}

.new-folder-input {
  padding: 12px 16px !important;
  margin: 0 !important;
  background-color: #1a1a1a !important;
  border-radius: 0 !important;
  border-bottom: 1px solid #333 !important;
}

.dialog-footer {
  display: flex;
  justify-content: space-between !important;
  gap: 10px;
  background-color: #1a1a1a !important;
  padding: 12px 16px !important;
}

.folder-btn {
  flex: 1;
  height: 40px;
}

.only-save {
  background-color: #333 !important;
  color: #fff !important;
  border: none !important;
}

.save-to-folder {
  background-color: #e74c3c !important;
  border-color: #e74c3c !important;
  color: #fff !important;
}

:deep(.el-dialog) {
  background-color: #1a1a1a !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  margin-top: 15vh !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-dialog__header) {
  background-color: #1a1a1a !important;
  padding: 16px !important;
  margin: 0 !important;
  border-bottom: 1px solid #333 !important;
}

:deep(.el-dialog__title) {
  color: #fff !important;
  font-size: 16px !important;
}

:deep(.el-dialog__headerbtn) {
  top: 16px !important;
}

:deep(.el-dialog__close) {
  color: #fff !important;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
  color: #fff !important;
  background-color: #1a1a1a !important;
}

:deep(.el-dialog__footer) {
  padding: 0 !important;
  background-color: #1a1a1a !important;
}

:deep(.el-checkbox__inner) {
  background-color: transparent !important;
  border-color: #666 !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff !important;
  border-color: #409eff !important;
}

:deep(.el-input__inner) {
  background-color: #333 !important;
  border-color: #444 !important;
  color: #fff !important;
}

:deep(.el-input-group__append) {
  background-color: #409eff !important;
  border-color: #409eff !important;
}

:deep(.el-input-group__append .el-button) {
  background-color: transparent !important;
  border: none !important;
  color: #fff !important;
}

:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.5) !important;
}

// 添加子评论样式
.comment-replies {
  margin-top: 12px;
  margin-left: 20px;

  .reply-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .comment-avatar {
      width: 32px;
      height: 32px;
    }

    .comment-content {
      font-size: 13px;
    }
  }
}

.reply-item {
  .comment-text {
    font-size: 13px;

    :deep(img) {
      max-width: 80px;
      max-height: 80px;
    }
  }
}

// 修复图片显示
:deep(.el-image) {
  display: inline-block;
}

/* 顶部关闭按钮样式已删除 */

// @ 用户面板样式
.at-panel {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  background-color: #252632;
  border: 1px solid #353542;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  z-index: 200;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  padding-bottom: 10px;
}

.at-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .at-title {
    color: #e6e6e6;
    font-size: 16px;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #e6e6e6;
    border-radius: 50%;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    i {
      font-size: 20px;
    }
  }
}

.at-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.at-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.at-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .at-avatar-container {
    width: 50px;
    height: 50px;
    margin-bottom: 8px;
    border-radius: 50%;
    overflow: hidden;
  }

  .at-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .at-name {
    color: #e6e6e6;
    font-size: 12px;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
  }
}

.at-empty {
  padding: 30px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;

  .at-empty-tip {
    font-size: 12px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.3);
  }
}

// 加载状态和空数据样式
.at-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: rgba(255, 255, 255, 0.6);

  i {
    font-size: 30px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}

.search-wrapper {
  padding: 10px 16px;
  background-color: #252632;

  .search-box {
    background-color: #353542;
    border-radius: 20px;
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;

    i {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      margin-right: 8px;
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      color: #e6e6e6;
      width: 100%;
      font-size: 14px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

// 表情包面板样式
.emoji-panel {
  position: absolute;
  bottom: 100px;
  left: 0;
  width: 100%;
  background-color: #252632;
  border: 1px solid #353542;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  z-index: 200;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  padding-bottom: 10px;
}

.emoji-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .emoji-title {
    color: #e6e6e6;
    font-size: 16px;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #e6e6e6;
    border-radius: 50%;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    i {
      font-size: 20px;
    }
  }
}

.emoji-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 10px;
}

.emoji-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .emoji-avatar-container {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .emoji-avatar {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.emoji-empty {
  padding: 30px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;

  .emoji-empty-tip {
    font-size: 12px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.3);
  }
}

// 加载状态和空数据样式
.emoji-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: rgba(255, 255, 255, 0.6);

  i {
    font-size: 30px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}

.emoji-search-wrapper {
  padding: 10px 16px;
  background-color: #252632;

  .emoji-search-box {
    background-color: #353542;
    border-radius: 20px;
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;

    i {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      margin-right: 8px;
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      color: #e6e6e6;
      width: 100%;
      font-size: 14px;

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

// 添加表情错误提示样式
.emoji-error {
  padding: 10px 15px;
  margin: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 5px;
  color: #ff6b6b;
  font-size: 12px;

  .emoji-error-item {
    margin: 5px 0;
    word-break: break-all;
  }
}
</style>
