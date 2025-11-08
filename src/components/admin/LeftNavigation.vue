<template>
  <div class="left-navigation">
    <div class="menu-left">
      <div class="menu-header">
        <div class="logo">
          <img src="/logo.png" alt="" />
        </div>
        <p>星视后台系统</p>
      </div>
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">expand</el-radio-button>
        <el-radio-button :value="true">collapse</el-radio-button>
      </el-radio-group> -->
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        router
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="/admin/datacenter">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据中心</template>
        </el-menu-item>
        <el-menu-item index="/admin/shenhe">
          <el-icon><icon-menu /></el-icon>
          <template #title>稿件审核</template>
        </el-menu-item>
        <el-menu-item index="/admin/setting">
          <el-icon><setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu as IconMenu, Setting, DataAnalysis } from '@element-plus/icons-vue'

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.left-navigation {
  border-right: 1px solid rgba(219, 223, 233, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  display: flex;
  height: 100vh;
  user-select: none;
  scrollbar-width: none;
  width: 240px;

  .menu-left {
    background: rgb(255, 255, 255);
    width: 100%;

    .menu-header {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      height: 60px;
      overflow: hidden;
      line-height: 60px;
      cursor: pointer;

      .logo {
        margin-left: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        width: 36px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      p {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 64px;
        box-sizing: border-box;
        margin-left: 10px;
        font-size: 18px;
        color: var(--xz-fontcolor);
        opacity: 1;
        font-weight: bold;
      }
    }

    .menu-bar {
      box-sizing: border-box;
      height: calc(100vh - 60px);
      overflow-y: auto;
      overscroll-behavior: contain;
      border-right: 0;
      scrollbar-width: none;
    }
  }
}
</style>
