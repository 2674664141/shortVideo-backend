<template>
  <div class="wode">
    <div class="container">
      <div class="header">
        <div class="user-info">
          <div class="user-avatar">
            <img :src="uStore.userInfo?.avatar" alt="" />
          </div>
          <div class="user-detail">
            <div class="user-name">
              <span class="text">{{ uStore.userInfo?.userName }}</span>
              <span class="edit" @click="editDialogVisible = true">
                <i class="ri-edit-line"></i>
              </span>
            </div>
            <div class="user-video-data flex">
              <div class="follow">
                <span class="text">关注</span>
                <span class="count">{{ uStore.userInfo?.userProfile.followingCount }}</span>
              </div>
              <span class="separator">|</span>
              <div class="follower">
                <span class="text">粉丝</span>
                <span class="count">{{ uStore.userInfo?.userProfile.followerCount }}</span>
              </div>
              <span class="separator">|</span>
              <div class="like">
                <span class="text">获赞</span>
                <span class="count">{{ uStore.userInfo?.userProfile.likeCount }}</span>
              </div>
            </div>
            <div class="user-tag">
              <div class="tag-item">
                <i class="ri-men-line"></i>
                <div class="text">{{ parseBirthdayToAge(uStore.userInfo?.birthday) }}岁</div>
              </div>
              <div class="tag-item">
                <div class="text">{{ uStore.userInfo?.region }}</div>
              </div>
            </div>
            <div class="user-desc">
              {{ uStore.userInfo?.signature }}
            </div>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="nav-wrapper">
          <div class="nav">
            <div @click="handleTo('post')" class="nav-item" :class="{ active: tab === 'post' }">
              <span>作品 {{ countData.videoCount }}</span>
            </div>
            <div @click="handleTo('like')" class="nav-item" :class="{ active: tab === 'like' }">
              <span>喜欢 {{ countData.likeCount }}</span>
            </div>
            <div
              @click="handleTo('collect')"
              class="nav-item"
              :class="{ active: tab === 'collect' }"
            >
              <span>收藏 {{ countData.favoriteCount }}</span>
            </div>
            <div
              @click="handleTo('history')"
              class="nav-item"
              :class="{ active: tab === 'history' }"
            >
              <span>历史 {{ countData.historyCount }}</span>
            </div>
          </div>
        </div>
        <div class="video-list-wrapper">
          <div class="video-list">
            <div
              class="video-item"
              @click="handlePlayVideo(video)"
              v-for="video in videoList"
              :key="video.id"
            >
              <div class="video-top">
                <div class="video-cover">
                  <img :src="video.coverUrl" alt="" />
                </div>
                <div class="video-data">
                  <i class="ri-play-line"></i>
                  <div class="count">{{ video.playCount }}</div>
                </div>
              </div>
              <div class="video-bottom">{{ video.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog align-center v-model="editDialogVisible" title="编辑资料" width="500">
      <template #default>
        <div class="upload-avatar">
          <div @click="avatarInput?.click()" class="user-avatar">
            <img :src="userProfileForm.avatar" alt="" />
            <div class="mask"></div>
            <input
              @change="handleUploadAvatar"
              type="file"
              style="display: none"
              ref="avatarInput"
            />
          </div>
          <div class="text">点击修改头像</div>
        </div>
        <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="userProfileForm"
          label-width="auto"
          label-position="top"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="userProfileForm.userName" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="userProfileForm.gender">
              <el-radio :value="1">男</el-radio>
              <el-radio :value="2">女</el-radio>
              <el-radio :value="0">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="userProfileForm.birthday"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleBirthdayChange"
            />
          </el-form-item>
          <el-form-item label="用户简介" prop="desc">
            <el-input
              type="textarea"
              :autosize="{
                minRows: 4,
                maxRows: 4
              }"
              v-model="userProfileForm.desc"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleChangeUserInfo"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { editUserInfoAPI } from '@/api/user'
import { getUserVideoByTabAPI, getVideoCountAPI } from '@/api/video'
import userStore from '@/store/user'
import type { VideoVO } from '@/type'
import { message, parseBirthdayToAge } from '@/utils'
import { uploadFile } from '@/utils/file'
import { playVideo } from '@/utils/video'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const uStore = userStore()

const route = useRoute()

const router = useRouter()

const avatarInput = ref<HTMLInputElement | null>(null)

const editDialogVisible = ref(false)

const tab = ref<string>('post')

const videoList = ref<VideoVO[]>([])

const countData = reactive({
  videoCount: 0,
  likeCount: 0,
  historyCount: 0,
  favoriteCount: 0
})

const userProfileForm = reactive<{
  userName?: string
  desc?: string
  avatar?: string
  gender?: number
  birthday?: string
  avatarFile?: File
}>({
  userName: uStore.userInfo?.userName,
  desc: uStore.userInfo?.signature,
  avatar: uStore.userInfo?.avatar,
  avatarFile: undefined,
  gender: uStore.userInfo?.gender,
  birthday: uStore.userInfo?.birthday ? `${uStore.userInfo.birthday} 00:00:00` : undefined
})

const handleTo = (query: string) => {
  tab.value = query
  router.push({
    path: route.path,
    query: {
      tab: query
    }
  })
}
// 新增：日期选择后自动补充时分秒
const handleBirthdayChange = (date: string) => {
  userProfileForm.birthday = date ? `${date} 00:00:00` : undefined;
}

watch(
  () => route.query.tab,
  (value) => {
    getData(value as string)
  }
)

const handlePlayVideo = (video: VideoVO) => {
  playVideo(video)
}

const handleChangeUserInfo = async () => {
  if (uStore.userInfo) {
    if (userProfileForm.avatarFile) {
      const res = await uploadFile(userProfileForm.avatarFile!, () => {})
      if (res.data.code === 200) {
        userProfileForm.avatar = res.data.data
      }
    }
    const res = await editUserInfoAPI({
      ...uStore.userInfo,
      userName: userProfileForm.userName!,
      signature: userProfileForm.desc!,
      avatar: userProfileForm.avatar!,
      gender: userProfileForm.gender!,
      birthday: userProfileForm.birthday!
    })
    if (res.data.code === 200) {
      editDialogVisible.value = false
      message({
        message: '修改成功',
        type: 'success'
      })
      return uStore.getUserInfo()
    }
    message({
      message: '修改失败',
      type: 'error'
    })
  }
}

const handleUploadAvatar = () => {
  if (avatarInput.value) {
    if (avatarInput.value.files) {
      const file = avatarInput.value.files[0]
      userProfileForm.avatarFile = file
      userProfileForm.avatar = URL.createObjectURL(file)
    }
  }
}

const getData = async (tab: string) => {
  const count = await getVideoCountAPI()
  if (count.data.code === 200) {
    countData.videoCount = count.data.data.videoCount
    countData.likeCount = count.data.data.likeCount
    countData.historyCount = count.data.data.historyCount
    countData.favoriteCount = count.data.data.favoriteCount
  }
  const res = await getUserVideoByTabAPI(tab)
  if (res.data.code === 200) {
    videoList.value = res.data.data
  }
}

onMounted(() => {
  getData((route.query.tab as string) || tab.value)
})
</script>

<style scoped>
.wode {
  padding: 5px 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  overflow: auto;

  .container {
    padding: 10px;
    background-color: var(--xz-card-bg);
    display: flex;
    flex-direction: column;

    .header {
      height: 120px;
      margin: 10px auto 21px;
      display: flex;
      position: relative;
      width: calc(100% - 60px);

      .user-info {
        display: flex;
        gap: 20px;

        .user-avatar {
          height: 100%;

          img {
            height: 100%;
            border-radius: 50%;
            max-width: 100%;
            max-height: 100%;
          }
        }

        .user-detail {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-left: 20px;

          .user-name {
            .text {
              font-weight: bold;
              font-size: 1.2rem;
              margin-right: 10px;
            }

            .edit {
              cursor: pointer;
            }
          }
          .user-video-data {
            gap: 20px;

            .text {
              color: var(--xz-secondtext);
              margin-right: 10px;
            }

            .separator {
              color: var(--xz-secondbg);
            }
          }

          .user-tag {
            display: flex;
            align-items: center;
            gap: 10px;

            .tag-item {
              background-color: var(--xz-secondbg);
              height: 20px;
              padding: 0 8px;
              display: flex;
              gap: 4px;
              align-items: center;
              border-radius: 4px;

              i.ri-men-line {
                font-size: 12px;
                color: skyblue;
              }

              i.ri-women-line {
                font-size: 12px;
                color: pink;
              }

              .text {
                font-size: 12px;
              }
            }
          }

          .user-desc {
            font-size: 12px;
          }
        }
      }
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0 30px;

      .nav-wrapper {
        height: 40px;
        display: flex;
        align-items: center;

        .nav {
          display: flex;
          align-items: center;
          gap: 40px;

          .nav-item {
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
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
      }

      .video-list-wrapper {
        margin-top: 20px;

        .video-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .video-item {
            width: calc(25% - 20px);
            height: fit-content;
            margin-bottom: 16px;
            margin-right: 16px;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            overflow: hidden;
            cursor: pointer;

            .video-top {
              height: 150px;
              background-color: #000;
              position: relative;

              .video-cover {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                  width: 100%;
                  max-height: 100%;
                  max-width: 100%;
                }
              }

              .video-data {
                position: absolute;
                width: 100%;
                height: 30px;
                display: flex;
                align-items: center;
                left: 0;
                bottom: 0;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);

                i {
                  font-size: 20px;
                  font-weight: bold;
                }

                .count {
                  font-weight: bold;
                }
              }
            }

            .video-bottom {
              padding-top: 10px;
              height: 30px;
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: bold;
            }
          }

          .video-item:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}

.upload-avatar {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .user-avatar {
    height: 108px;
    width: 108px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    .mask {
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.3);
      background-image: url(https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/ic_camera.83cedda541865a49.svg);
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 32px 32px;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .text {
      font-size: 14px;
      margin-top: 10px;
      color: var(--xz-secondtext);
    }
  }
}
</style>
