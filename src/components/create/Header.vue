<template>
  <div class="header">
    <div class="container">
      <div class="left-container">
        <div class="title">星视创作中心</div>
        <a class="nav" href="/">
          <img src="/logo.png" alt="" />
          <span>主站</span>
        </a>
      </div>
      <div class="right-container">
        <div class="user-info">
          <a href="/user">
            <img :src="uStore.userInfo?.avatar" alt="" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import userStore from '@/store/user'
import { onMounted } from 'vue'

const uStore = userStore()

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
  document.documentElement.classList.add('light')
  document.documentElement.classList.remove('dark')
})
</script>

<style scoped>
.header {
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--xz-card-bg);
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 0 40px;

    .left-container {
      display: flex;
      align-items: center;

      .title {
        font-weight: bold;
        font-size: 1.2rem;
        margin-right: 32px;
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 4px;

        img {
          width: 32px;
          height: 32px;
        }
      }
    }

    .right-container {
      .user-info {
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
