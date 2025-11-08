<template>
  <div class="left-nav">
    <div class="upload-btn">
      <div @click="handleToUpload" class="btn primary">
        <i class="ri-upload-cloud-2-line"></i>
        上传作品
      </div>
    </div>
    <ul class="nav">
      <div @click="handleToDataCenter" class="nav-item">
        <i class="ri-line-chart-line"></i>
        <span>数据中心</span>
      </div>
      <div @click="handleToVideoManager" class="nav-item">
        <i class="ri-movie-2-ai-line"></i>
        <span>稿件管理</span>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleToUpload = () => {
  router.push('/create/tougao')
}

const handleToVideoManager = () => {
  router.push('/create/manage')
}

const handleToDataCenter = () => {
  router.push('/create/datacenter')
}
</script>

<style scoped>
.left-nav {
  width: 200px;
  background-color: var(--xz-card-bg);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .upload-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 24px 32px;

    .btn {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
  }

  .nav {
    display: flex;
    flex-direction: column;

    .nav-item {
      padding: 0 24px 0 32px;
      display: flex;
      align-items: center;
      gap: 20px;
      height: 46px;
      transition: all 0.3s ease;

      &:hover {
        background-color: var(--xz-secondbg);
      }

      i {
        font-size: 20px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
