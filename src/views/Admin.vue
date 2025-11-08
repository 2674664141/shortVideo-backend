<template>
  <div class="admin">
    <Header></Header>
    <LeftNavigation></LeftNavigation>
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/admin/Header.vue'
import LeftNavigation from '@/components/admin/LeftNavigation.vue'
import homeStore from '@/store/home'
import { onMounted } from 'vue'

const hStore = homeStore()

onMounted(() => {
  hStore.theme = 'light'
  document.documentElement.setAttribute('data-theme', hStore.theme)
  document.documentElement.classList.add('light')
  document.documentElement.classList.remove('dark')
})
</script>

<style scoped>
.admin {
  padding-left: 240px;
  padding-top: 106px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  transition: padding 0.3s ease-in-out;
  background-color: #fafbfc;

  .layout-content {
    margin: 0 20px;
  }
}
</style>
