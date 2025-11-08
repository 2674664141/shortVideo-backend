import { createApp } from 'vue'
// element-plus相关导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
// 全局样式
import './style.css'
// 主题样式
import './theme.css'
// remixicon图标库
import 'remixicon/fonts/remixicon.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// pinia状态管理
import { createPinia } from 'pinia'
// vue-router配置
import router from './router'
import App from './App.vue'

const app = createApp(App)

Fancybox.bind('[data-fancybox]', {})
app.use(router)
app.use(createPinia())
app.use(ElementPlus, {
  locale: zhCn
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
