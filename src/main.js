/**
 * 应用入口文件
 * 初始化 Vue 实例和全局配置
 */

// 导入核心依赖
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入 Element UI 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 安装 Element UI 插件
Vue.use(ElementUI)

// 关闭生产环境提示
Vue.config.productionTip = false

// 全局错误处理配置
Vue.config.errorHandler = (err, vm, info) => {
  // 忽略广告拦截器导致的错误
  if (err.message && err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    return;
  }
  // 输出其他错误到控制台
  console.error(err);
};

// 创建 Vue 根实例
new Vue({
  router,        // 注入路由
  store,         // 注入状态管理
  render: h => h(App)  // 渲染根组件
}).$mount('#app')  // 挂载到 #app 节点
