/**
 * 登录组件
 * 实现用户登录认证功能
 * 包含用户名密码输入和表单验证
 */

<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录面板 -->
    <div class="login-panel">
      <!-- 页面头部：标题和图标 -->
      <div class="panel-header">
        <i class="el-icon-reading logo-icon"></i>
        <h2>图书管理系统</h2>
      </div>
      
      <!-- 登录表单 -->
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginForm" 
        class="login-form"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin">  <!-- 支持回车登录 -->
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-btn"
            @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <!-- 没有账号，去注册 -->
        <div class="register-link">
          <span>没有账号？</span>
          <a href="#/register" @click.prevent="goToRegister">去注册</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: '',  // 用户名
        password: ''   // 密码
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    /**
     * 处理登录请求
     * 验证表单数据并尝试登录
     */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 查找匹配的用户
          const user = this.$store.state.users.find(
            u => u.username === this.loginForm.username && 
                (u.password === this.loginForm.password || u.password === this.loginForm.password + '_encrypted') &&
                // 管理员和图书管理员始终可以登录，不受状态限制
                // 普通用户必须处于启用状态(status=1)才能登录
                (u.role === 'admin' || u.role === 'librarian' || u.status === 1)
          )
          
          if (user) {
            // 登录成功处理
            this.$store.commit('setCurrentUser', user)  // 保存用户信息
            this.$message.success('登录成功')          // 显示成功提示
            this.$router.push('/')                    // 跳转到首页
          } else {
            // 登录失败处理
            this.$message.error('用户名或密码错误')
          }
        }
      })
    },
    
    // 跳转到注册页面
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
/* 登录页面容器样式 */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

/* 登录面板样式 */
.login-panel {
  width: 380px;
  padding: 35px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 页面头部样式 */
.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

/* Logo图标样式 */
.logo-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 16px;
}

/* 标题样式 */
.panel-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  font-weight: 500;
}

/* 登录表单样式 */
.login-form {
  margin-bottom: 24px;
}

/* 输入框样式调整 */
.login-form :deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

.login-form :deep(.el-form-item__content) {
  line-height: 40px;
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 注册链接样式 */
.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #909399;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 交互动效 */
.el-input {
  transition: all 0.3s ease;
}

.el-input:hover {
  transform: translateY(-1px);
}

.login-btn {
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: #1a1a1a;
  }
  
  .login-panel {
    background: #2c2c2c;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }

  .panel-header h2 {
    color: #e6e6e6;
  }
}
</style>