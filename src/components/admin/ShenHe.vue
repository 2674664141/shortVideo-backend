<template>
  <div class="shenhe">
    <div class="console">
      <el-table :data="shenheVideoList" style="width: 100%" height="500">
        <el-table-column align="center" fixed prop="createdTime" label="日期" width="150">
          <template #default="scope">
            <div class="video-date">
              {{ parseTime(scope.row.createdTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed prop="name" label="视频预览" width="250">
          <template #default="scope">
            <a :href="scope.row.videoUrl" data-fancybox :data-caption="scope.row.title">
              <img :src="scope.row.coverUrl" alt="Video poster" />
            </a>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed prop="title" label="视频标题" width="200">
          <template #default="scope">
            <p class="video-title">{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="city" label="视频封面" width="250">
          <template #default="scope">
            <div class="video-cover">
              <a data-fancybox :data-src="scope.row.coverUrl" :data-caption="scope.row.title">
                <img :src="scope.row.coverUrl" />
              </a>
              <!-- <img :src="scope.row.coverUrl" alt="" /> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="视频描述" width="200">
          <template #default="scope">
            <div class="video-desc">
              {{ scope.row.description }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="zip" label="视频分类">
          <template #default="scope">
            <div class="video-category">
              {{ getVideoCategory(scope.row.categoryId) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="zip" width="200" label="视频标签">
          <template #default="scope">
            <div class="tags">
              <el-tag v-for="tag in scope.row.tags.split(',')">
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核操作" width="200">
          <template #default="scope">
            <div class="action">
              <el-popconfirm
                @confirm="handleVideoPass(scope.row)"
                class="box-item"
                title="确定通过吗"
                placement="top"
              >
                <template #reference>
                  <div class="btn primary">审核通过</div>
                </template>
              </el-popconfirm>
              <el-popconfirm class="box-item" title="确定不通过吗" placement="top">
                <template #reference>
                  <div class="btn danger">不通过</div>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          v-model:current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getShenHeCountAPI, getShenHeVideoList, videoPassAPI } from '@/api/admin'
import { VIDEO_CATEGORY } from '@/constant'
import type { VideoVO } from '@/type'
import { message } from '@/utils'
import { onMounted, ref } from 'vue'

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

const getVideoCategory = (id: number) => {
  return VIDEO_CATEGORY.find((item) => item.id === id)?.text || ''
}

const shenheVideoList = ref<VideoVO[]>()

const getVideoData = async (offset: number, pageSize: number) => {
  const res = await getShenHeVideoList(offset, pageSize)
  if (res.data.code === 200) {
    shenheVideoList.value = res.data.data
  }
}

const handleVideoPass = async (video: VideoVO) => {
  const res = await videoPassAPI(video.id, true)
  if (res.data.code === 200) {
    message({
      type: 'success',
      message: '审核成功'
    })
    await getShenHeCount()
    await getVideoData((currentPage.value - 1) * pageSize.value, pageSize.value)
  }
}

const handleCurrentChange = (page: number) => {
  getVideoData((page - 1) * pageSize.value, pageSize.value)
}

const parseTime = (time: string) => {
  const date = new Date(time)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}

const getShenHeCount = async () => {
  const res = await getShenHeCountAPI()
  if (res.data.code === 200) {
    total.value = res.data.data
  }
}

onMounted(() => {
  getVideoData(currentPage.value - 1, pageSize.value)
  getShenHeCount()
})
</script>

<style scoped>
.shenhe {
  height: 100%;
  width: 100%;
}

.video-title {
  font-weight: bold;
}

.video-cover {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.action {
  display: flex;
  gap: 20px;
  align-items: center;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.video-category {
  font-weight: bold;
}

.page-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
