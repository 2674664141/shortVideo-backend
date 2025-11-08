<template>
  <div class="video-edit">
    <div v-show="!isSuccess" class="edit-container">
      <div class="edit-header">
        <span class="title">发布视频</span>
      </div>
      <div class="upload-detail">
        <div class="file-item">
          <div class="file-item-icon">
            <i class="ri-file-video-fill"></i>
          </div>
          <div class="file-item-content">
            <div class="file-item-content-detail">
              <div class="file-item-content-detail-text">
                <span>{{ store.videoInfo.videoName }}</span>
              </div>
            </div>
            <div class="file-item-content-progress">
              <el-progress :percentage="Math.min(store.uploadInfo.progress, 100)" />
            </div>
          </div>
        </div>
      </div>
      <div class="edit-body">
        <div class="video-form">
          <div class="title">
            <span>基本设置</span>
          </div>
          <div class="form-item">
            <div class="video-cover">
              <div class="form-title">
                <p class="title-deg">*</p>
                <div class="text">封面</div>
              </div>
              <div class="video-cover-content">
                <div class="video-cover-main">
                  <div class="video-cover-main-img">
                    <div
                      :style="{
                        background: `url(${store.videoInfo.videoCover}) center center / cover no-repeat rgb(244, 245, 247)`
                      }"
                      class="img cover"
                    ></div>
                    <div class="actions">
                      <span @click="handleChangeCover">更换封面</span>
                      <input
                        type="file"
                        style="display: none"
                        accept="image/*"
                        ref="coverInputRef"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="video-title">
              <div class="form-title">
                <p class="title-deg">*</p>
                <div class="text">标题</div>
              </div>
              <div class="video-title-content">
                <div class="video-title-input">
                  <el-input
                    v-model="store.videoInfo.videoTitle"
                    maxlength="80"
                    show-word-limit
                    placeholder=""
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="video-type">
              <div class="form-title">
                <p class="title-deg">*</p>
                <div class="text">类型</div>
              </div>
              <div class="video-type-content">
                <el-radio-group v-model="store.videoInfo.videoType">
                  <el-radio :value="1">自制</el-radio>
                  <el-radio :value="2">转载</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="video-category">
              <div class="form-title">
                <p class="title-deg">*</p>
                <div class="text">分类</div>
              </div>
              <div class="video-category-content">
                <el-select
                  default-first-option
                  v-model="store.videoInfo.videoCategoryId"
                  style="width: 240px"
                  effect="light"
                >
                  <el-option
                    v-for="item in VIDEO_CATEGORY"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="video-tag">
              <div class="form-title">
                <p class="title-deg">*</p>
                <div class="text">标签</div>
              </div>
              <div class="video-tag-content">
                <div class="video-tag-input">
                  <el-input
                    @keydown.enter.prevent="handleTagEnter"
                    v-model="tag"
                    maxlength="20"
                    show-word-limit
                    placeholder=""
                  ></el-input>
                </div>
                <div class="video-tags" style="margin-top: 10px">
                  <el-tag
                    v-for="tag in store.videoInfo.videoTag"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    effect="dark"
                    style="margin-right: 10px; margin-bottom: 5px"
                    @close="handleTagClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <span style="font-size: 12px"
                    >还可以添加{{ 10 - store.videoInfo.videoTag.length }}个标签</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="video-desc">
              <div class="form-title">
                <p class="title-deg"></p>
                <div class="text">简介</div>
              </div>
              <div class="video-desc-content">
                <el-input
                  v-model="store.videoInfo.videoDesc"
                  style="width: 100%"
                  :autosize="{
                    minRows: 8,
                    maxRows: 8
                  }"
                  show-word-limit
                  maxlength="2000"
                  type="textarea"
                  placeholder="填写视频的简介信息，让更多人发现你的视频"
                />
              </div>
            </div>
          </div>
          <div class="form-item">
            <div class="form-action">
              <div class="btn warning">存草稿</div>
              <div class="btn primary" @click="handleSubmit">立即投稿</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isSuccess" class="success-container">
      <img src="/tougao.png" />
      <el-text class="mx-1" size="large" type="success">稿件上传成功</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIDEO_CATEGORY } from '@/constant'
import tougaoStore from '@/store/create'
import { message } from '@/utils'
import { base64ToFile } from '@/utils/file'
import { ref } from 'vue'

const tag = ref('')

const coverInputRef = ref()

const coverFile = ref<File>()

const isUploading = ref(false)

const isSuccess = ref(false)

const store = tougaoStore()

const handleTagClose = (tag: string) => {
  store.videoInfo.videoTag = store.videoInfo.videoTag.filter((item) => item !== tag)
}

const handleChangeCover = () => {
  coverInputRef.value.click()
  coverInputRef.value.onchange = () => {
    const file = coverInputRef.value.files[0]
    coverFile.value = file
    store.videoInfo.videoCover = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (isUploading.value) {
    return message({
      type: 'warning',
      message: '正在上传视频，请勿重复上传'
    })
  }
  if (!store.checkSubmit()) {
    return message({
      type: 'error',
      message: '请填写完整信息'
    })
  }
  isUploading.value = true
  if (coverFile.value) {
    await store.submitCover(coverFile.value)
  } else {
    const file = base64ToFile(store.videoInfo.videoCover, 'cover.jpeg', 'image/jpeg')
    file && (await store.submitCover(file))
  }
  isSuccess.value = await store.submitVideo()
  isUploading.value = false
}

const handleTagEnter = () => {
  if (store.videoInfo.videoTag.length >= 10) {
    return message({
      type: 'error',
      message: '标签不能超过10个'
    })
  }
  if (!tag.value.trim().length) {
    return message({
      type: 'error',
      message: '标签不能为空'
    })
  }
  if (store.videoInfo.videoTag.includes(tag.value.trim())) {
    return message({
      type: 'error',
      message: '标签已存在'
    })
  }
  store.videoInfo.videoTag.push(tag.value.trim())
  tag.value = ''
}
</script>

<style scoped>
.video-edit {
  margin: 0px 70px;
  height: 100%;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;

  .edit-container {
    background-color: var(--xz-card-bg);
    overflow: auto;
    height: 100%;
    width: 100%;

    .edit-header {
      padding: 0 32px;
      display: flex;
      align-items: center;
      height: 70px;
      line-height: 28px;
      /* border-bottom: var(--style-border); */
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

      .title {
        font-weight: bold;
        font-size: 1.1rem;
      }
    }

    .upload-detail {
      background-color: var(--xz-secondbg);
      padding: 20px 12px;
      margin: 0 32px;
      margin-top: 23px;

      .file-item {
        display: flex;
        align-items: center;

        .file-item-content {
          width: 838px;
        }

        .file-item-icon {
          margin-right: 20px;
        }

        i {
          font-size: 40px;
          color: rgb(33, 137, 178);
        }
      }
    }

    .edit-body {
      padding: 0 32px;
      margin-top: 32px;

      .video-form {
        display: flex;
        flex-direction: column;
        width: 80%;
        min-width: 900px;

        .title {
          span {
            font-weight: bold;
            font-size: 1.1rem;
          }
        }

        .form-item {
          display: flex;
          align-items: center;
          margin-top: 24px;

          .video-cover,
          .video-title,
          .video-type,
          .video-category,
          .video-desc,
          .video-tag {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .video-desc,
          .video-tag,
          .video-cover {
            align-items: start;
          }

          .video-title-content,
          .video-desc-content,
          .video-cover-content,
          .video-tag-content {
            flex: 1;
          }

          .video-cover-main {
            width: 168px;
            height: 126px;
            display: flex;
            align-items: flex-end;
            position: relative;

            .cover {
              width: 168px;
              height: 126px;
              border-radius: 4px;
              position: relative;
              cursor: pointer;
            }

            .actions {
              display: flex;
              opacity: 0.8;
              position: absolute;
              bottom: 0;
              align-items: center;
              font-size: 12px;
              color: var(--xz-white);
              justify-content: center;
              text-align: center;
              width: 100%;
              border-radius: 0 0 4px 4px;
              z-index: 1;
              background: rgba(0, 0, 0, 0.7);
              cursor: pointer;
              padding: 6px 0;
              box-sizing: border-box;
              height: 28px;

              span {
                height: 28px;
                line-height: 28px;
                width: 50%;
                -webkit-user-select: none;
                user-select: none;
                transition: all 0.3s ease;

                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

          .form-title {
            display: inline-flex;
            align-items: center;
            position: relative;
            flex-wrap: wrap;
            width: 134px;

            .title-deg {
              font-size: 16px;
              color: #ff3b30;
              line-height: 16px;
              width: 12px;
            }

            .text {
              font-size: 14px;
              line-height: 16px;
              font-weight: 400;
            }
          }
        }

        .form-action {
          display: flex;
          align-items: flex-end;
          padding: 32px 0 32px 134px;
          position: relative;
          gap: 20px;

          .btn {
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
          }
        }
      }
    }
  }

  .success-container {
    background-color: var(--xz-card-bg);
    overflow: auto;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      width: 300px;
      height: 300px;
      margin-bottom: 10px;
    }
  }
}
</style>
