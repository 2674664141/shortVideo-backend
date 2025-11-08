<template>
  <div class="tougao">
    <Header></Header>
    <div class="main-content">
      <LeftNav></LeftNav>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/create/Header.vue'
import LeftNav from '@/components/create/LeftNav.vue'
</script>

<style scoped>
.tougao {
  width: 100%;
  height: 100%;

  .main-content {
    padding-top: 60px;
    height: 100%;
    width: 100%;
    display: flex;

    .content {
      width: calc(100% - 200px);
    }
  }
}
</style>
