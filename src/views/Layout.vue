/**
 * 布局组件
 * 实现系统的整体布局结构
 * 包含侧边栏导航、顶部栏等
 */

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">
        <!-- 移除未使用的图片导入，优化性能 -->
        <span>图书管理系统</span>
      </div>
      <el-menu
          :router="true"
          :default-active="$route.path"
          background-color="transparent"
          text-color="rgba(255,255,255,0.85)"
          active-text-color="#ffffff"
          :unique-opened="true"
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-menu"></i>
            <span>首页</span>
          </el-menu-item>
          <!-- 用户管理 - 仅管理员或有用户管理权限的用户可见 -->
          <el-menu-item 
            v-if="canManageUsers"
            index="/users">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <!-- 图书管理 - 所有用户可见，但只有管理员或有图书管理权限的用户可以编辑 -->
          <el-menu-item index="/books">
            <i class="el-icon-reading"></i>
            <span>图书管理</span>
          </el-menu-item>
          <!-- 分类管理 - 仅管理员或有分类管理权限的用户可见 -->
          <el-menu-item 
            v-if="canManageCategories"
            index="/categories">
            <i class="el-icon-collection"></i>
            <span>分类管理</span>
          </el-menu-item>
          <!-- 借阅记录 - 仅管理员或有借阅记录管理权限的用户可见 -->
          <el-menu-item 
            v-if="canManageBorrowRecords"
            index="/borrow-records">
            <i class="el-icon-document-copy"></i>
            <span>借阅记录</span>
          </el-menu-item>
          <!-- AI推荐 - 所有用户可见 -->
          <el-menu-item index="/recommendations">
            <i class="el-icon-star-on"></i>
            <span>AI推荐</span>
          </el-menu-item>
        </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <i class="el-icon-s-fold toggle-sidebar"></i>
        </div>
        <div class="header-right">
          <!-- 主题切换下拉菜单 -->
          <el-dropdown trigger="click" @command="switchTheme" class="theme-switcher">
            <span class="el-dropdown-link">
              <i class="el-icon-magic-stick"></i> 主题
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="default">
                  <i class="el-icon-collection-tag"></i> 默认主题
                </el-dropdown-item>
                <el-dropdown-item command="dark">
                  <i class="el-icon-collection-tag"></i> 日落橙主题
                </el-dropdown-item>

                <el-dropdown-item command="glass">
                  <i class="el-icon-collection-tag"></i> 玻璃拟态主题
                </el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          
          <!-- 用户信息 -->
          <div class="user-info">
            <el-avatar :size="32" icon="el-icon-user"></el-avatar>
            <span class="username">{{ currentUser.username }}</span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">
                  <i class="el-icon-switch-button"></i> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'MainLayout',
  created() {
    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'default';
    this.applyTheme(savedTheme);
  },
  computed: {
        currentUser() {
          return this.$store.state.currentUser
        },
        isAdmin() {
          return this.currentUser && this.currentUser.role === 'admin'
        },
        // 权限控制计算属性
        canManageUsers() {
          if (!this.currentUser) return false
          return this.currentUser.role === 'admin' || 
                 (this.currentUser.permissions && this.currentUser.permissions.manageUsers)
        },
        canManageBooks() {
          if (!this.currentUser) return false
          return this.currentUser.role === 'admin' || 
                 this.currentUser.role === 'librarian' ||
                 (this.currentUser.permissions && this.currentUser.permissions.manageBooks)
        },
        canManageCategories() {
          if (!this.currentUser) return false
          return this.currentUser.role === 'admin' || 
                 this.currentUser.role === 'librarian' ||
                 (this.currentUser.permissions && this.currentUser.permissions.manageCategories)
        },
        canManageBorrowRecords() {
          if (!this.currentUser) return false
          return this.currentUser.role === 'admin' || 
                 this.currentUser.role === 'librarian' ||
                 (this.currentUser.permissions && this.currentUser.permissions.manageBorrowRecords)
        }
      },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确认退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('setCurrentUser', null)
          this.$message.success('已退出登录')
          this.$router.push('/login')
        }).catch(() => {})
      }
    },
    
    // 切换主题
    switchTheme(theme) {
      this.applyTheme(theme);
      localStorage.setItem('theme', theme);
      this.$message.success(`已切换到${this.getThemeName(theme)}`);
    },
    
    // 应用主题
    applyTheme(theme) {
        // 移除所有主题类
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-glass');
        // 添加当前主题类
        document.body.classList.add(`theme-${theme}`);
      },
    
    // 获取主题名称
    getThemeName(theme) {
      const themeNames = {
        default: '默认主题',
        dark: '日落橙主题',
        glass: '玻璃拟态主题'
      };
      return themeNames[theme] || '默认主题';
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  transition: background 0.3s;
}

/* 默认主题布局背景 */
body.theme-default .layout-container {
  background: linear-gradient(135deg, #1a2233 0%, #1e2845 100%);
}

body.theme-default .el-aside {
  background: rgba(26, 34, 51, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

/* 日落橙主题布局背景 */
body.theme-dark .layout-container {
  background: linear-gradient(135deg, #4a2c2a 0%, #602e25 100%);
}

body.theme-dark .el-aside {
  background: rgba(86, 55, 52, 0.95);
  border-right: 1px solid rgba(245, 158, 11, 0.2);
}

/* 移除日落橙主题，已合并到.theme-dark选择器中 */
/* 侧边栏基础样式 */
.el-aside {
  backdrop-filter: blur(10px);
  transition: width 0.3s, background 0.3s, border-right 0.3s;
  overflow: hidden;
  position: relative;
}

/* 添加流光效果 - 响应主题 */
.el-aside::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  transform: rotate(45deg);
  animation: flow 3s infinite;
}

body.theme-default .el-aside::before {
  background: linear-gradient(90deg, transparent, rgba(82, 190, 255, 0.2), transparent);
}

body.theme-dark .el-aside::before {
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent);
}



@keyframes flow {
  0% { left: -150%; }
  50% { left: -60%; }
  100% { left: 150%; }
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  backdrop-filter: blur(10px);
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  letter-spacing: 1px;
  transition: all 0.3s;
}

/* 主题化logo样式 */
body.theme-default .logo {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(82, 190, 255, 0.1);
  text-shadow: 0 0 15px rgba(82, 190, 255, 0.7);
}

body.theme-default .logo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #52beff, transparent);
}

body.theme-dark .logo {
  color: #fff9ed;
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

body.theme-dark .logo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #f59e0b, transparent);
}



.el-menu {
  border-right: none;
  background: transparent !important;
}

.el-menu-item {
  margin: 8px 16px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  font-weight: 500;
  letter-spacing: 1px;
}

.el-menu-item span {
  font-size: 15px;
  text-shadow: 0 0 10px rgba(82, 190, 255, 0.3);
}

/* 主题化菜单项激活样式 */
body.theme-default .el-menu-item.is-active {
  background: linear-gradient(45deg, #2196f3, #52beff) !important;
  color: #ffffff !important;
  box-shadow: 0 0 20px rgba(82, 190, 255, 0.4);
}

body.theme-dark .el-menu-item.is-active {
  background: linear-gradient(45deg, #d97706, #f59e0b) !important;
  color: #4a2c2a !important;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}



/* 菜单项激活时的文字效果 */
.el-menu-item.is-active span {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  font-weight: bold;
}

/* 主题化菜单项悬停样式 */
body.theme-default .el-menu-item:hover {
  background: rgba(82, 190, 255, 0.15) !important;
  color: #ffffff !important;
}

body.theme-dark .el-menu-item:hover {
  background: rgba(245, 158, 11, 0.15) !important;
  color: #fff9ed !important;
}



/* 悬停时的文字效果 */
body.theme-default .el-menu-item:hover span {
  text-shadow: 0 0 12px rgba(82, 190, 255, 0.5);
}

body.theme-dark .el-menu-item:hover span {
  text-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
}



/* 通用菜单项样式 */
.el-menu-item {
  margin: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  font-weight: 500;
  letter-spacing: 1px;
  transform: translateX(0);
}

.el-menu-item:hover {
  transform: translateX(5px);
}

/* 菜单项微光效果 */
.el-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: 0.5s;
}

body.theme-default .el-menu-item::before {
  background: linear-gradient(90deg, transparent, rgba(82, 190, 255, 0.2), transparent);
}

body.theme-dark .el-menu-item::before {
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent);
}



.el-menu-item:hover::before {
  left: 100%;
}

.el-header {
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: all 0.3s;
}

/* 主题化顶部栏样式 */
body.theme-default .el-header {
  background: rgba(26, 34, 51, 0.8);
  border-bottom: 1px solid rgba(82, 190, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

body.theme-dark .el-header {
  background: rgba(86, 55, 52, 0.8);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 4px 20px rgba(40, 20, 10, 0.3);
}



/* 主题化侧边栏切换图标 */
body.theme-default .toggle-sidebar {
  font-size: 20px;
  color: #52beff;
  cursor: pointer;
  padding: 0 12px;
  transition: all 0.3s;
}

body.theme-default .toggle-sidebar:hover {
  text-shadow: 0 0 10px rgba(82, 190, 255, 0.5);
  transform: rotate(180deg);
}

body.theme-dark .toggle-sidebar {
  font-size: 20px;
  color: #f59e0b;
  cursor: pointer;
  padding: 0 12px;
  transition: all 0.3s;
}

body.theme-dark .toggle-sidebar:hover {
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
  transform: rotate(180deg);
}



.header-right {
  display: flex;
  align-items: center;
}

/* 主题切换器样式 */
.theme-switcher {
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-switcher:hover {
  transform: scale(1.05);
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 15px;
  height: 40px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

/* 主题化用户信息样式 */
body.theme-default .user-info {
  background: rgba(82, 190, 255, 0.1);
  border: 1px solid rgba(82, 190, 255, 0.2);
}

body.theme-default .user-info:hover {
  background: rgba(82, 190, 255, 0.15);
  box-shadow: 0 0 20px rgba(82, 190, 255, 0.2);
}

body.theme-default .username {
  color: #fff;
  text-shadow: 0 0 10px rgba(82, 190, 255, 0.3);
}

body.theme-default .el-dropdown-link {
  color: #52beff;
}

body.theme-dark .user-info {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

body.theme-dark .user-info:hover {
  background: rgba(245, 158, 11, 0.15);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

body.theme-dark .username {
  color: #fff9ed;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}

body.theme-dark .el-dropdown-link {
  color: #f59e0b;
}



/* 用户名通用样式 */
.username {
  margin: 0 8px;
  font-size: 14px;
}

/* 用户信息通用悬停效果 */
.user-info:hover {
  transform: translateY(-2px);
}

/* 主内容区域 */
.el-main {
  padding: 20px;
  background: transparent;
}

/* 菜单图标样式 */
.el-menu-item i {
  margin-right: 10px;
  font-size: 18px;
  transition: all 0.3s;
}

/* 主题化菜单项图标样式 */
body.theme-default .el-menu-item i {
  color: rgba(255, 255, 255, 0.9);
}

body.theme-default .el-menu-item:hover i {
  color: #ffffff;
  transform: scale(1.2);
  text-shadow: 0 0 12px rgba(82, 190, 255, 0.5);
}

body.theme-dark .el-menu-item i {
  color: rgba(255, 249, 237, 0.9);
}

body.theme-dark .el-menu-item:hover i {
  color: #fff9ed;
  transform: scale(1.2);
  text-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
}



/* 激活状态图标通用样式 */
.el-menu-item.is-active i {
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

/* 头像样式 */
.el-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(82, 190, 255, 0.3);
  transition: all 0.3s;
}

/* 主题化头像样式 */
body.theme-default .el-avatar {
  background: linear-gradient(45deg, #2196f3, #52beff);
  box-shadow: 0 0 10px rgba(82, 190, 255, 0.3);
}

body.theme-dark .el-avatar {
  background: linear-gradient(45deg, #d97706, #f59e0b);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}



/* 添加霓虹灯效果 - 响应主题 */
@keyframes neon-default {
  0% { box-shadow: 0 0 5px rgba(82, 190, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(82, 190, 255, 0.4); }
  100% { box-shadow: 0 0 5px rgba(82, 190, 255, 0.2); }
}

@keyframes neon-dark {
  0% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.2); }
  50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
  100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.2); }
}



body.theme-default .el-menu-item.is-active {
  animation: neon-default 2s infinite;
}

  body.theme-dark .el-menu-item.is-active {
  animation: neon-dark 2s infinite;
}



/* 下拉菜单样式 - 响应主题 */
.el-dropdown-menu {
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

body.theme-default .el-dropdown-menu {
  background: rgba(26, 34, 51, 0.95) !important;
  border: 1px solid rgba(82, 190, 255, 0.1);
}

body.theme-default .el-dropdown-menu__item {
  color: rgba(255, 255, 255, 0.8) !important;
}

body.theme-default .el-dropdown-menu__item:hover {
  background: rgba(82, 190, 255, 0.1) !important;
  color: #52beff !important;
}

body.theme-default .el-dropdown-menu__item i {
  color: #52beff;
}

body.theme-dark .el-dropdown-menu {
  background: rgba(86, 55, 52, 0.95) !important;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

body.theme-dark .el-dropdown-menu__item {
  color: rgba(255, 249, 237, 0.8) !important;
}

body.theme-dark .el-dropdown-menu__item:hover {
  background: rgba(245, 158, 11, 0.1) !important;
  color: #f59e0b !important;
}

body.theme-dark .el-dropdown-menu__item i {
  color: #f59e0b;
}



/* ========================== 玻璃拟态主题 - 布局样式 ========================== */
body.theme-glass .layout-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf5 100%);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
    radial-gradient(circle at 75% 75%, rgba(220, 230, 250, 0.5) 0%, transparent 40%);
}

body.theme-glass .el-aside {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 3px 0 20px rgba(166, 180, 200, 0.1);
}

body.theme-glass .el-aside::before {
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.2), transparent);
}

body.theme-glass .logo {
  color: #3b82f6;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(166, 180, 200, 0.1);
}

body.theme-glass .logo::after {
  background: linear-gradient(90deg, transparent, #60a5fa, transparent);
}

body.theme-glass .el-menu-item {
  color: #334155 !important;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 5px rgba(166, 180, 200, 0.05);
  font-weight: 500;
}

body.theme-glass .el-menu-item span {
  text-shadow: none;
  font-weight: 500;
}

body.theme-glass .el-menu-item::before {
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.2), transparent);
}

body.theme-glass .el-menu-item.is-active {
  background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

body.theme-glass .el-menu-item:hover {
  background: rgba(96, 165, 250, 0.1) !important;
  color: #3b82f6 !important;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

body.theme-glass .el-menu-item:hover span {
  text-shadow: 0 0 5px rgba(96, 165, 250, 0.3);
}

body.theme-glass .el-menu-item i {
  color: rgba(51, 65, 85, 0.8);
}

body.theme-glass .el-menu-item:hover i {
  color: #3b82f6;
  transform: scale(1.2);
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

body.theme-glass .el-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(166, 180, 200, 0.1);
}

body.theme-glass .toggle-sidebar {
  color: #3b82f6;
}

body.theme-glass .toggle-sidebar:hover {
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

body.theme-glass .user-info {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 10px rgba(166, 180, 200, 0.1);
}

body.theme-glass .user-info:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

body.theme-glass .username {
  color: #334155;
  font-weight: 600;
}

body.theme-glass .el-dropdown-link {
  color: #3b82f6;
}

body.theme-glass .el-avatar {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  box-shadow: 0 2px 10px rgba(96, 165, 250, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

body.theme-glass .el-dropdown-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px rgba(166, 180, 200, 0.15);
  border-radius: 10px;
  overflow: hidden;
}

body.theme-glass .el-dropdown-menu__item {
  color: rgba(51, 65, 85, 0.8) !important;
  font-weight: 500;
  border-radius: 4px;
}

body.theme-glass .el-dropdown-menu__item:hover {
  background: rgba(96, 165, 250, 0.1) !important;
  color: #3b82f6 !important;
}

body.theme-glass .el-dropdown-menu__item i {
  color: #3b82f6;
}

/* 玻璃拟态主题激活菜单项动画 */
@keyframes glass-hover {
  0% { box-shadow: 0 0 10px rgba(96, 165, 250, 0.2); }
  50% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.4); }
  100% { box-shadow: 0 0 10px rgba(96, 165, 250, 0.2); }
}

body.theme-glass .el-menu-item.is-active {
  animation: glass-hover 2s infinite ease-in-out;
}

</style>