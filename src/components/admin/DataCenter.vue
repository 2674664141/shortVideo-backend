<template>
  <div class="data-center">
    <div class="console">
      <div class="title">平台总体数据概览</div>
      <div class="card-list">
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总播放量</div>
            <div class="number box-title">{{ platformData?.totalPlayCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-play-circle-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总投稿量</div>
            <div class="number box-title">{{ platformData?.totalVideoCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-video-ai-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总点赞数</div>
            <div class="number box-title">{{ platformData?.totalLikeCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-thumb-up-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总收藏数</div>
            <div class="number box-title">{{ platformData?.totalFavoriteCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-star-smile-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总分享数</div>
            <div class="number box-title">{{ platformData?.totalShareCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-share-circle-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总评论数</div>
            <div class="number box-title">{{ platformData?.totalCommentCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-chat-smile-ai-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">总用户数</div>
            <div class="number box-title">{{ platformData?.totalUserCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-user-5-line"></i>
          </div>
        </div>
        <div class="card-item">
          <div class="card-content">
            <div class="sub-title des">待审核稿件</div>
            <div class="number box-title">{{ platformData?.totalAuditCount }}</div>
            <div class="change-box">
              <span class="change-text">较上周</span>
              <span class="change-text-success">+20%</span>
            </div>
            <i class="ri-inbox-line"></i>
          </div>
        </div>
      </div>
      <div class="title">周数据增长趋势</div>
      <div class="chart-list">
        <div class="chart-row">
          <div class="chart-container">
            <div id="interactionChart" style="width: 100%; height: 400px"></div>
          </div>
          <div class="chart-container">
            <div id="userVideoChart" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPlatformDataAPI, getPlatformWeekDataAPI } from '@/api/admin'
import type { DailyStatisticsVO, PlatformDataVO } from '@/type/admin'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const platformData = ref<PlatformDataVO>()
const weekDataList = ref<DailyStatisticsVO[]>([])

// 初始化互动数据图表（简化版）
const initInteractionChart = () => {
  const chartDom = document.getElementById('interactionChart')
  if (!chartDom) return

  const myChart = echarts.init(chartDom)

  const dates = weekDataList.value.map((item) => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  const option = {
    title: {
      text: '平台互动数据',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['播放量', '收藏量', '评论量', '点赞量', '分享量'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '播放量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.playCount),
        itemStyle: { color: '#5470C6' }
      },
      {
        name: '收藏量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.favoriteCount),
        itemStyle: { color: '#91CC75' }
      },
      {
        name: '评论量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.commentCount),
        itemStyle: { color: '#FAC858' }
      },
      {
        name: '点赞量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.likeCount),
        itemStyle: { color: '#EE6666' }
      },
      {
        name: '分享量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.shareCount),
        itemStyle: { color: '#73C0DE' }
      }
    ]
  }

  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

// 初始化用户和投稿数据图表（简化版）
const initUserVideoChart = () => {
  const chartDom = document.getElementById('userVideoChart')
  if (!chartDom) return

  const myChart = echarts.init(chartDom)

  const dates = weekDataList.value.map((item) => {
    const date = new Date(item.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  const option = {
    title: {
      text: '用户与投稿数据',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '投稿量'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.newUserCount),
        itemStyle: { color: '#3BA272' }
      },
      {
        name: '投稿量',
        type: 'line',
        smooth: 0.3,
        data: weekDataList.value.map((item) => item.videoCount),
        itemStyle: { color: '#9A60B4' }
      }
    ]
  }

  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

onMounted(async () => {
  const res = await getPlatformDataAPI()
  const r = await getPlatformWeekDataAPI()

  if (r.data.code === 200) {
    weekDataList.value = r.data.data
    setTimeout(() => {
      initInteractionChart()
      initUserVideoChart()
    }, 100)
  }

  if (res.data.code === 200) {
    platformData.value = res.data.data
  }
})
</script>

<style scoped>
.chart-list {
  margin-top: 20px;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-container {
  flex: 1;
  min-width: 400px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .chart-row {
    flex-direction: column;
  }

  .chart-container {
    min-width: 100%;
  }
}

.console {
  .title {
    font-weight: bold;
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  background-color: transparent;

  .card-item {
    flex: 0 0 25%;
    max-width: 25%;
    padding: 0 10px;

    .card-content {
      margin-bottom: 20px;
      background: var(--xz-card-bg);
      border-radius: 12px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 140px;
      padding: 0 18px;
      list-style: none;
      transition: all 0.3s ease;
      border: 1px solid rgba(219, 223, 233, 0.6);

      .sub-title {
        display: block;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        color: var(--xz-secondtext);
      }

      .number {
        display: block;
        margin-top: 10px;
        font-size: 28px;
        font-weight: 400;
      }

      .change-box {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .change-text {
          display: block;
          font-size: 13px;
          color: rgb(120, 130, 157);
        }

        .change-text-success {
          display: block;
          margin-left: 5px;
          font-size: 13px;
          font-weight: bold;
          color: rgb(19, 222, 185);
        }
      }

      i {
        position: absolute;
        top: 0;
        right: 20px;
        bottom: 0;
        width: 52px;
        height: 52px;
        margin: auto;
        overflow: hidden;
        font-size: 22px;
        line-height: 52px;
        color: rgb(93, 135, 255);
        text-align: center;
        background-color: rgb(238, 243, 255);
        border-radius: 12px;
      }
    }
  }
}
</style>
