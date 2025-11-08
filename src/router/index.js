/**
 * 路由配置文件
 * 定义应用的路由规则和导航守卫
 */

// 导入Vue和Vue Router
import Vue from 'vue';
import VueRouter from 'vue-router';
// 导入登录和布局组件
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';
// 导入状态管理
import store from '../store';

// 安装Vue Router插件
Vue.use(VueRouter);

// 导入注册组件
import Register from '../views/Register.vue';

// 定义路由配置
const routes = [
  // 登录页路由
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // 注册页路由
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  // 主布局路由，包含子路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', // 重定向到仪表盘
    children: [
      // 仪表盘页面
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue') // 懒加载组件
      },
      // 用户管理页面
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/Users.vue')
      },
      // 图书管理页面
      {
        path: 'books',
        name: 'Books',
        component: () => import('../views/Books.vue')
      },
      // 分类管理页面
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/Categories.vue')
      },
      // 借阅记录管理页面
      {
        path: 'borrow-records',
        name: 'BorrowRecords',
        component: () => import('../views/BorrowRecords.vue')
      },
      // AI图书推荐页面
      {
        path: 'recommendations',
        name: 'BookRecommendations',
        component: () => import('../views/BookRecommendations.vue')
      }
    ]
  }
];

// 创建路由实例
const router = new VueRouter({
  routes
});

// 全局路由守卫
// 在每次路由跳转前检查登录状态
router.beforeEach((to, from, next) => {
  // 如果不是访问登录页、注册页且未登录，则重定向到登录页
  if (to.path !== '/login' && to.path !== '/register' && !store.state.currentUser) {
    next('/login');
  } else {
    next(); // 允许继续访问
  }
});

// 导出路由实例
export default router;