<template>
  <div class="header">
    <div class="menu">
      <div class="left">
        <div class="btn-box">
          <div class="menu-btn">
            <i class="ri-refresh-line"></i>
          </div>
        </div>
        <nav class="breadcrumb">
          <ul>
            <li>
              <div>
                <span>数据中心</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div class="right">
        <el-popover width="200" effect="dark" class="box-item" placement="bottom">
          <template #reference>
            <div class="user">
              <img src="https://img.hoshinagi.top/blog/avatar.png" alt="" />
            </div>
          </template>
          <template #default>
            <div class="user-detail">
              <div class="content">
                <div class="user-info">
                  <div class="user-avatar">
                    <img src="https://img.hoshinagi.top/blog/avatar.png" alt="" />
                  </div>
                  <div class="user-profile">
                    <div class="user-name">admin</div>
                    <div class="user-email">admin@163.com</div>
                  </div>
                </div>
                <div class="action">
                  <div @click="handleLogout" class="btn danger">退出登录</div>
                </div>
              </div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  router.push({
    path: '/'
  })
}
</script>

<style scoped>
.header {
  width: calc(100% - 240px);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  background-color: rgb(250, 251, 252);
  transition: all 0.3s ease-in-out;

  .menu {
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
    user-select: none;
    -webkit-user-select: none;

    .left {
      line-height: 60px;
      display: flex;

      .btn-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 60px;

        .menu-btn {
          display: block;
          width: 38px;
          height: 38px;
          line-height: 38px;
          text-align: center;
          cursor: pointer;
          margin-left: 10px;
          border-radius: 6px;
          transition: all 0.2s;

          i {
            display: block;
            font-size: 19px;
            color: rgb(120, 130, 157);
          }
        }
      }

      .breadcrumb {
        margin-left: 10px;

        ul {
          display: flex;

          li {
            font-size: 13px;
            color: rgb(75, 86, 117) !important;
            display: flex;
            align-items: center;
            cursor: pointer;

            span {
              font-size: 13px;
            }
          }
        }
      }
    }

    .right {
      display: flex;

      .user {
        display: flex;
        align-items: center;
        height: 60px;
        padding: 0 10px;
        line-height: 60px;
        transition: background-color 0.3s;

        img {
          width: 34px;
          height: 34px;
          margin: 0 10px 0 0;
          overflow: hidden;
          cursor: pointer;
          background: #eee;
          border-radius: 50%;
        }
      }
    }
  }
}

.user-detail {
  .content {
    display: flex;
    flex-direction: column;

    .user-info {
      display: flex;

      img {
        width: 34px;
        height: 34px;
        margin: 0 10px 0 0;
        overflow: hidden;
        cursor: pointer;
        background: #eee;
        border-radius: 50%;
      }

      .user-profile {
        .user-name {
          font-weight: bold;
          font-size: 1rem;
        }

        .user-email {
          font-size: 12px;
        }
      }
    }

    .action {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        font-size: 0.7rem;
        padding: 0.2rem 0.8rem;
      }
    }
  }
}
</style>
