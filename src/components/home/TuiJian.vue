<template>
  <div class="tuijian">
    <div class="video-content">
      <VideoPlayer
        v-if="isLoaded"
        @wheel="handleWheel"
        @updateVideoInfo="handleUpdateVideoInfo"
        :fullPlay="false"
        :video-info="tuijianVideoList[currentIndex]"
      ></VideoPlayer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTuiJianVideoAPI, getVideoInfoAPI } from '@/api/video'
import VideoPlayer from '@/common/VideoPlayer.vue'
import type { VideoVO } from '@/type'
import { onMounted, ref } from 'vue'

const tuijianVideoList = ref<VideoVO[]>([])

const currentPage = ref(0)

const pageSize = 9

const currentIndex = ref(0)

const isChanging = ref(false)

const isLoaded = ref(false)

const handleWheel = async (e: WheelEvent) => {
  if (isChanging.value) {
    return
  }
  if (e.deltaY > 5) {
    if (currentIndex.value < tuijianVideoList.value.length - 1) {
      currentIndex.value = currentIndex.value + 1
    } else {
      currentPage.value = currentPage.value + 1
      const res = await getTuiJianVideoAPI(currentPage.value * pageSize, pageSize)
      tuijianVideoList.value = [...tuijianVideoList.value, ...res.data.data]
      currentIndex.value = currentIndex.value + 1
    }
    isChanging.value = true
    setTimeout(() => {
      isChanging.value = false
    }, 1000)
    return
  }
  if (e.deltaY < -5) {
    if (currentIndex.value > 0) {
      currentIndex.value = currentIndex.value - 1
      isChanging.value = true
      setTimeout(() => {
        isChanging.value = false
      }, 1000)
    }
    return
  }
}

const handleUpdateVideoInfo = async (id: number) => {
  const res = await getVideoInfoAPI(id)
  if (res.data.code === 200) {
    tuijianVideoList.value[tuijianVideoList.value.findIndex((item) => item.id === id)] =
      res.data.data
  }
}

const getVideoInfo = async () => {
  const res = await getTuiJianVideoAPI(currentPage.value * pageSize, pageSize)
  if (res.data.code === 200) {
    tuijianVideoList.value = res.data.data
  }
}

onMounted(async () => {
  await getVideoInfo()
  isLoaded.value = true
})
</script>

<style scoped lang="scss">
.tuijian {
  padding: 5px 10px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .video-content {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }
}
</style>
