<template>
  <div class="video-upload">
    <div class="upload-container">
      <div class="upload-nav">
        <span class="upload-nav-item active">视频投稿</span>
        <span class="upload-nav-item">专栏投稿</span>
        <span class="upload-nav-item">视频素材投稿</span>
      </div>
      <div class="upload-body">
        <div class="upload-body-content">
          <UploadArea
            @upload="handleUpload"
            upload-text="将视频拖拽到这里或者点击上传视频"
          ></UploadArea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadArea from '@/common/UploadArea.vue'
import tougaoStore from '@/store/create'
import { message } from '@/utils'

const store = tougaoStore()

const handleUpload = (fileList: FileList) => {
  const file = fileList[0]
  if (!file.type.startsWith('video')) {
    // do something with the video file
    return message({
      type: 'error',
      message: '必须上传视频'
    })
  }
  store.uploadVideo(file)
}
</script>

<style scoped>
.video-upload {
  margin: 0px 70px;
  height: 100%;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;

  .upload-container {
    background-color: var(--xz-card-bg);
    height: 100%;
    width: 100%;

    .upload-nav {
      height: 64px;
      border-bottom: 1px solid var(--xz-secondbg);

      .upload-nav-item {
        line-height: 64px;
        padding-bottom: 18px;
        padding-top: 26px;
        margin-left: 40px;
        font-size: 16px;
        height: 100%;
        color: #505050;
        cursor: pointer;

        &.active {
          color: #00a1d6;
          font-weight: 700;
          border-bottom: 3px solid #00a1d6;
        }
      }
    }

    .upload-body {
      height: calc(100% - 64px);
      width: 100%;

      .upload-body-content {
        height: 100%;
        width: 100%;
        padding: 10px 135px;
      }
    }
  }
}
</style>
