<template>
  <div class="tougao">
    <VideoUpload v-show="!store.videoInfo.video"></VideoUpload>
    <VideoEdit v-show="store.videoInfo.video"></VideoEdit>
  </div>
</template>

<script setup lang="ts">
import VideoEdit from './VideoEdit.vue'
import VideoUpload from './VideoUpload.vue'

import createStore from '@/store/create'

const store = createStore()
</script>

<style scoped>
.tougao {
  width: 100%;
  height: 100%;
}
</style>
