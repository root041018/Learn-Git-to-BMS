/**
 * 用户管理组件
 * 实现用户的增删改查功能
 * 包含用户状态管理和权限控制
 */

<template>
  <div class="users-container">
    <!-- 页面头部：标题和操作按钮 -->
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
          class="search-input"
        ></el-input>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加用户</el-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <el-card shadow="hover" class="table-card">
      <el-table 
        :data="paginatedUsers" 
        border 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column label="用户信息" min-width="200">
          <template slot-scope="scope">
            <div class="user-info">
              <el-avatar :size="40" icon="el-icon-user"></el-avatar>
              <div class="user-details">
                <div class="username">{{ scope.row.username }}</div>
                <div class="role">
                  <el-tag 
                    :type="getRoleType(scope.row.role)"
                    size="small"
                  >
                    {{ getRoleName(scope.row.role) }}
                  </el-tag>
                </div>
                <div v-if="currentUser.role === 'admin'" class="permissions-summary">
                  {{ getPermissionsSummary(scope.row.permissions) }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime || new Date()) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
              :disabled="scope.row.id === currentUser.id"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              type="primary" 
              icon="el-icon-edit"
              plain
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              size="mini" 
              type="danger"
              icon="el-icon-delete"
              plain
              @click="handleDelete(scope.row)"
              :disabled="scope.row.id === currentUser.id"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredUsers.length"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="userForm" 
        :rules="rules" 
        ref="userForm" 
        label-width="100px"
        :status-icon="true"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            type="password" 
            v-model="userForm.password" 
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="图书管理员" value="librarian"></el-option>
          </el-select>
        </el-form-item>
        <!-- 细粒度权限设置（仅管理员可见） -->
        <el-collapse v-if="currentUser.role === 'admin' && userForm.role !== 'admin'" accordion>
          <el-collapse-item title="详细权限设置" name="permissions">
            <el-form-item label="管理用户">
              <el-switch v-model="userForm.permissions.manageUsers" active-text="允许" inactive-text="禁止"></el-switch>
            </el-form-item>
            <el-form-item label="管理图书">
              <el-switch v-model="userForm.permissions.manageBooks" active-text="允许" inactive-text="禁止"></el-switch>
            </el-form-item>
            <el-form-item label="管理分类">
              <el-switch v-model="userForm.permissions.manageCategories" active-text="允许" inactive-text="禁止"></el-switch>
            </el-form-item>
            <el-form-item label="管理借阅记录">
              <el-switch v-model="userForm.permissions.manageBorrowRecords" active-text="允许" inactive-text="禁止"></el-switch>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      searchQuery: '',        // 搜索关键词
      dialogVisible: false,   // 对话框显示状态
      dialogTitle: '',        // 对话框标题
      loading: false,         // 加载状态
      submitting: false,      // 提交状态
      currentPage: 1,         // 当前页码
      pageSize: 10,          // 每页显示数量
      userForm: {            // 用户表单数据
        username: '',
        password: '',
        role: 'user',
        status: 1,
        permissions: {
          manageUsers: false,
          manageBooks: false,
          manageCategories: false,
          manageBorrowRecords: false
        }
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      editingUserId: null
    }
  },
  computed: {
    users() {
      return this.$store.state.users
    },
    currentUser() {
      return this.$store.state.currentUser
    },
    filteredUsers() {
      if (!this.searchQuery) return this.users
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.username.toLowerCase().includes(query)
      )
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredUsers.slice(start, end)
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleStatusChange(user) {
      this.$store.commit('updateUser', user)
      this.$message.success(`已${user.status === 1 ? '启用' : '禁用'}该用户`)
    },
    handleAdd() {
      this.dialogTitle = '添加用户'
      this.editingUserId = null
      this.userForm = {
        username: '',
        password: '',
        role: 'user',
        status: 1,
        permissions: {
          manageUsers: false,
          manageBooks: false,
          manageCategories: false,
          manageBorrowRecords: false
        }
      }
      this.dialogVisible = true
    },
    handleEdit(user) {
      this.dialogTitle = '编辑用户'
      this.editingUserId = user.id
      this.userForm = {
        ...user,
        password: '',
        permissions: user.permissions || {
          manageUsers: false,
          manageBooks: false,
          manageCategories: false,
          manageBorrowRecords: false
        }
      }
      this.dialogVisible = true
    },
    handleDelete(user) {
      if (user.id === this.currentUser.id) {
        this.$message.warning('不能删除当前登录用户')
        return
      }
      
      // 防止删除唯一的管理员
      if (user.role === 'admin') {
        const adminCount = this.users.filter(u => u.role === 'admin' && u.id !== user.id && u.status === 1).length
        if (adminCount === 0) {
          this.$message.warning('不能删除最后一个活跃的管理员')
          return
        }
      }
      
      this.$confirm('确认删除该用户吗？此操作不可恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        setTimeout(() => {
          this.$store.commit('deleteUser', user.id)
          this.$message.success('删除成功')
          this.loading = false
        }, 500)
      }).catch(() => {})
    },
    handleSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.editingUserId) {
            // 编辑用户
            this.$store.commit('updateUser', {
              id: this.editingUserId,
              ...this.userForm
            })
          } else {
            // 添加用户
            this.$store.commit('addUser', {
              id: new Date().getTime(),
              ...this.userForm,
              createdTime: new Date()
            })
          }
          this.dialogVisible = false
          this.$message.success(this.editingUserId ? '用户更新成功' : '用户添加成功')
        } else {
          return false
        }
      })
    },
    // 角色类型映射
    getRoleType(role) {
      switch(role) {
        case 'admin':
          return 'danger'
        case 'librarian':
          return 'warning'
        case 'user':
        default:
          return 'success'
      }
    },
    // 角色名称映射
    getRoleName(role) {
      switch(role) {
        case 'admin':
          return '管理员'
        case 'librarian':
          return '图书管理员'
        case 'user':
        default:
          return '普通用户'
      }
    },
    // 权限摘要显示
    getPermissionsSummary(permissions) {
      if (!permissions) return '无特殊权限'
      
      const permissionNames = []
      if (permissions.manageUsers) permissionNames.push('用户管理')
      if (permissions.manageBooks) permissionNames.push('图书管理')
      if (permissions.manageCategories) permissionNames.push('分类管理')
      if (permissions.manageBorrowRecords) permissionNames.push('借阅记录')
      
      if (permissionNames.length === 0) {
        return '无特殊权限'
      } else {
        return '权限: ' + permissionNames.join(', ')
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 200px;
}

.table-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  font-weight: bold;
  color: #303133;
}

.role {
  font-size: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__body {
  padding: 30px 40px;
}

.dialog-footer {
  text-align: right;
}

/* 添加一些动画效果 */
.el-table .el-button {
  transition: all 0.3s;
}

.el-table .el-button:hover {
  transform: translateY(-2px);
}

.el-card {
  transition: all 0.3s;
}

.el-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>