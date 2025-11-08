<template>
  <div v-show="props.show" class="video-comment">
    <div class="video-comment-container">
      <div class="comment-header">
        <div class="category-list">
          <div class="category-item active">
            <span>评论</span>
          </div>
        </div>
        <div @click="handleCloseComment" class="close">
          <i class="ri-close-line"></i>
        </div>
      </div>
      <div class="comment-body">
        <div class="title">全部评论({{ commentList.length }})</div>
        <div class="comment-list">
          <div class="comment-item" v-for="comment in commentList" :key="comment.id">
            <div class="comment-user-avatar">
              <img :src="comment.avatar" alt="" />
            </div>
            <div class="comment-info">
              <div class="comment-user-name">
                {{
                  props.videoInfo?.userId === comment.userId
                    ? `${comment.userName} (作者)`
                    : comment.userName
                }}
              </div>
              <div class="comment-content" v-html="comment.content"></div>
              <div class="comment-time">{{ parseCommentTime(new Date(comment.createdTime)) }}</div>
              <div class="comment-action">
                <div class="comment-action-item" style="margin-right: 10px">
                  <i style="margin-right: 3px" class="ri-chat-smile-ai-line"></i>
                  <span>回复</span>
                </div>
                <div class="comment-action-item" style="margin-right: 10px">
                  <i style="margin-right: 3px" class="ri-share-line"></i>
                  <span>分享</span>
                </div>
                <div class="comment-action-item" style="margin-right: 10px">
                  <i style="margin-right: 3px" class="ri-heart-line"></i>
                  <span>{{ 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-input">
          <input
            ref="commentInput"
            v-model="commentContent"
            type="text"
            placeholder="留下你的精彩评论吧"
            @keydown.enter="handleComment"
          />
          <div @click="showEmoji = !showEmoji" class="emoji-icon">
            <i class="ri-emoji-sticker-line"></i>
          </div>
          <div class="emoji-container">
            <Emoji @select-emoji="handleSelectEmoji" v-model:show="showEmoji"></Emoji>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoVO } from '@/type'
import { onMounted, ref, watch } from 'vue'
import Emoji from './Emoji.vue'
import { getVideoCommentAPI, videoCommentAPI } from '@/api/comment'
import { EMOJI_LIST_MAP } from '@/constant/social'
import { message } from '@/utils'
import type { CommentVO } from '@/type/comment'
import userStore from '@/store/user'

const uStore = userStore()

const props = defineProps<{
  videoInfo?: VideoVO
  show: boolean
}>()

const emits = defineEmits(['update:show'])

const commentContent = ref('')

const commentInput = ref<HTMLInputElement | null>(null)

const commentList = ref<CommentVO[]>([])

const showEmoji = ref(false)

const handleSelectEmoji = (emoji: any) => {
  commentContent.value = commentContent.value + `[${emoji.name}]`
  commentInput.value?.focus()
}

const handleCloseComment = () => {
  commentContent.value = ''
  showEmoji.value = false
  emits('update:show', false)
}

const parseCommentTime = (time: Date) => {
  const current = Date.now()
  const seconds = Math.floor((current - time.getTime()) / 1000)
  const days = Math.floor(seconds / 86400)
  if (seconds < 60) {
    return '刚刚'
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟前`
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}小时前`
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}天前`
  }
  if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  }
  if (days < 365) {
    return `${Math.floor(days / 30)}个月前`
  }
  return `${Math.floor(days / 365)}年前`
}

/**
 * 转换字符串，将纯文本用<span>包裹，将表情标记[表情X]转换为<img>
 * @param {string} text - 输入的字符串
 * @param {Object} emojiMap - 表情映射表，如 { "表情1": "url1", "表情2": "url2" }
 * @return {string} - 转换后的HTML字符串
 */
const convertTextWithEmoji = (text: string, emojiMap: Record<string, string>) => {
  // 正则匹配 [表情X] 格式
  const emojiRegex = /\[([^\]]+)\]/g

  // 使用 split 和 map 处理文本和表情
  const parts = text.split(emojiRegex)
  const matches = text.match(emojiRegex) || []

  let result = ''
  let index = 0

  // 遍历所有部分
  for (let i = 0; i < parts.length; i++) {
    // 纯文本部分（偶数索引）
    if (i % 2 === 0) {
      if (parts[i]) {
        result += `<span>${parts[i]}</span>`
      }
    }
    // 表情部分（奇数索引）
    else {
      const emojiKey = matches[index++]
      const emojiName = emojiKey.slice(1, -1) // 去掉 []
      const emojiUrl = emojiMap[emojiName]

      if (emojiUrl) {
        result += `<img src="${emojiUrl}" alt="${emojiName}" class="emoji-img" />`
      } else {
        // 如果找不到对应的表情，保留原始文本
        result += `<span>${emojiKey}</span>`
      }
    }
  }

  return result
}

const handleComment = async () => {
  const result = convertTextWithEmoji(commentContent.value, EMOJI_LIST_MAP)
  const res = await videoCommentAPI({
    videoId: props.videoInfo?.id,
    content: result
  })
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: '评论成功'
    })
    commentContent.value = ''
    getComment()
  }
}

const getComment = async () => {
  if (props.videoInfo?.id) {
    const res = await getVideoCommentAPI(props.videoInfo?.id)
    if (res.data.code === 200) {
      commentList.value = res.data.data
    }
  }
}

watch(
  () => props.videoInfo,
  () => {
    getComment()
  }
)

onMounted(async () => {
  getComment()
})
</script>

<style scoped>
.video-comment {
  width: 100%;
  height: 100%;

  .video-comment-container {
    padding: 20px;
    width: 100%;
    height: 100%;

    .comment-header {
      height: 40px;
      position: relative;

      .category-list {
        display: flex;
        align-items: center;
        gap: 40px;
        height: 40px;

        .category-item {
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          padding: 10px 10px 0 10px;
          color: var(--xz-secondtext);
          transition: all 0.3s ease;
          position: relative;

          &:hover {
            color: var(--xz-fontcolor);
          }

          &.active::before {
            content: '';
            display: block;
            width: 16px;
            height: 3px;
            background: #fe2c55;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 9px);
          }
        }
      }

      .close {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        color: var(--xz-secondtext);
        transition: all 0.3s ease;

        &:hover {
          color: var(--xz-fontcolor);
        }

        i {
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }

    .comment-body {
      height: calc(100% - 40px);
      .title {
        font-size: 14px;
        margin-top: 20px;
        height: 20px;
        margin-bottom: 10px;
      }

      .comment-list {
        height: calc(100% - 90px);
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow: scroll;

        .comment-item {
          display: flex;
          height: fit-content;

          .comment-user-avatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .comment-info {
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            width: calc(100% - 50px);

            .comment-user-name {
              font-size: 0.9rem;
              margin-bottom: 4px;
              color: var(--xz-secondtext);
            }

            .comment-time {
              font-size: 0.725rem;
            }

            .comment-action {
              display: flex;
              align-items: center;
              margin-top: 10px;
              color: var(--xz-secondtext);

              .comment-action-item {
                transition: all 0.3s ease;

                &:hover {
                  color: var(--xz-fontcolor);
                }
              }
            }
          }
        }
      }

      .comment-input {
        height: 60px;
        padding: 5px 10px 10px;
        position: relative;

        input {
          height: 100%;
          width: 100%;
          outline: none;
          border: 1px solid transparent;
          text-indent: 0.8rem;
          font-size: 0.9rem;
          border-radius: var(--xz-main-radius);
          transition: all 0.3s ease-in-out;

          &:focus {
            border: var(--style-border-hover);
          }

          &:hover {
            border: var(--style-border-hover);
          }
        }

        .emoji-icon {
          position: absolute;
          top: 50%;
          right: 7%;
          transform: translateY(-53%);
          height: 30px;
          width: 30px;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease-in-out;

          &:hover {
            background-color: var(--xz-theme);
          }

          i {
            font-size: 1.5rem;
          }
        }

        .emoji-container {
          position: absolute;
          top: 0;
          left: 0;
          transform: translateY(-100%);
        }
      }
    }
  }
}
</style>
