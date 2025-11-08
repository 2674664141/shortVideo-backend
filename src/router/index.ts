import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Home.vue'),
      redirect: '/jingxuan',
      children: [
        {
          path: '/jingxuan',
          name: 'jingxuan',
          component: () => import('@/components/home/JingXuan.vue')
        },
        {
          path: '/tuijian',
          name: 'tuijian',
          component: () => import('@/components/home/TuiJian.vue')
        },
        {
          path: '/wode',
          name: 'wode',
          component: () => import('@/components/home/WoDe.vue')
        },
        {
          path: '/guanzhu',
          name: 'guanzhu',
          component: () => import('@/components/home/GuanZhu.vue')
        },
        {
          path: '/fensi',
          name: 'fensi',
          component: () => import('@/components/home/FenSi.vue')
        }
      ]
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/Create.vue'),
      redirect: '/create/tougao',
      children: [
        {
          path: '/create/tougao',
          name: 'tougao',
          component: () => import('@/components/create/TouGao.vue')
        },
        {
          path: '/create/datacenter',
          name: 'data',
          component: () => import('@/components/create/DataCenter.vue')
        },
        {
          path: '/create/manage',
          name: 'manage',
          component: () => import('@/components/create/VideoManager.vue')
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/Search.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/datacenter',
      component: () => import('@/views/Admin.vue'),
      children: [
        {
          path: '/admin/datacenter',
          name: 'datacenter',
          component: () => import('@/components/admin/DataCenter.vue')
        },
        {
          path: '/admin/shenhe',
          name: 'shenhe',
          component: () => import('@/components/admin/ShenHe.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 路由拦截，token处理等操作在这里进行
  console.log(to, from)
  next()
})

router.afterEach((to, from) => {
  // 路由跳转后
  console.log(to, from)
})

export default router
