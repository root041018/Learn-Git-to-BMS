<!--
 * 注册组件
 * 实现用户注册功能
 * 包含用户名、密码、邮箱等字段的表单验证
 -->

<template>
  <!-- 注册页面容器 -->
  <div class="register-container">
    <!-- 注册面板 -->
    <div class="register-panel">
      <!-- 页面头部：标题和图标 -->
      <div class="panel-header">
        <i class="el-icon-reading logo-icon"></i>
        <h2>用户注册</h2>
      </div>
      
      <!-- 注册表单 -->
      <el-form 
        :model="registerForm" 
        :rules="rules" 
        ref="registerForm" 
        class="register-form"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <!-- 确认密码输入框 -->
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请再次输入密码">
          </el-input>
        </el-form-item>
        <!-- 邮箱输入框 -->
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email"
            prefix-icon="el-icon-message"
            placeholder="请输入邮箱">
          </el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            class="register-btn"
            @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
        <!-- 已有账号，去登录 -->
        <div class="login-link">
          <span>已有账号？</span>
          <a href="#/login" @click.prevent="goToLogin">去登录</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  
  data() {
    // 确认密码验证函数
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    // 用户名唯一性验证
    const validateUsername = (rule, value, callback) => {
      const exists = this.$store.state.users.some(user => user.username === value);
      if (exists) {
        callback(new Error('用户名已存在'));
      } else {
        callback();
      }
    };
    
    return {
      // 注册表单数据
      registerForm: {
        username: '',  // 用户名
        password: '',  // 密码
        confirmPassword: '', // 确认密码
        email: '',     // 邮箱
        role: 'user',  // 默认用户角色
        createTime: new Date().toISOString().split('T')[0] // 创建时间
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    /**
     * 处理注册请求
     * 验证表单数据并尝试注册
     */
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          // 由于是前端模拟，我们简单地进行密码加密（实际项目中应该使用更安全的加密方式）
          const userData = {
            ...this.registerForm,
            // 简单的密码加密（实际项目中应使用bcrypt等安全的加密方式）
            password: this.simpleEncrypt(this.registerForm.password)
          };
          
          // 提交注册信息
          this.$store.commit('addUser', userData);
          this.$message.success('注册成功，请登录');
          // 跳转到登录页面
          this.$router.push('/login');
        }
      })
    },
    
    // 简单的密码加密函数（仅用于演示）
    simpleEncrypt(password) {
      // 在实际项目中，应该使用更安全的加密方式
      return password + '_encrypted';
    },
    
    // 跳转到登录页面
    goToLogin() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* 注册页面容器样式 */
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

/* 注册面板样式 */
.register-panel {
  width: 420px;
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

/* 注册表单样式 */
.register-form {
  margin-bottom: 24px;
}

/* 输入框样式调整 */
.register-form :deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

.register-form :deep(.el-form-item__content) {
  line-height: 40px;
}

/* 注册按钮样式 */
.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 登录链接样式 */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #909399;
}

.login-link a {
  color: #409EFF;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 交互动效 */
.el-input {
  transition: all 0.3s ease;
}

.el-input:hover {
  transform: translateY(-1px);
}

.register-btn {
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .register-container {
    background: #1a1a1a;
  }
  
  .register-panel {
    background: #2c2c2c;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }

  .panel-header h2 {
    color: #e6e6e6;
  }
  
  .login-link {
    color: #909399;
  }
}
</style>