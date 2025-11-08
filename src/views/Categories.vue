/**
 * 分类管理组件
 * 实现图书分类的增删改查功能
 * 包含分类统计和数据可视化
 */

<template>
  <!-- 页面容器 -->
  <div class="categories-container">
    <!-- 页面头部：标题和操作按钮 -->
    <div class="page-header">
      <h2>分类管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索分类名称"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
          class="search-input"
        ></el-input>
        <el-button 
          v-if="canManageCategories"
          type="primary" 
          icon="el-icon-plus" 
          @click="handleAdd"
        >添加分类</el-button>
      </div>
    </div>

    <!-- 分类列表和统计信息 -->
    <el-row :gutter="20">
      <!-- 左侧：分类列表表格 -->
      <el-col :span="16">
        <el-card shadow="hover" class="table-card">
          <!-- 分类数据表格 -->
          <el-table 
            :data="filteredCategories" 
            border 
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column label="分类信息" min-width="200">
              <template slot-scope="scope">
                <div class="category-info">
                  <div class="category-icon">
                    <i class="el-icon-collection-tag"></i>
                  </div>
                  <div class="category-details">
                    <div class="category-name">{{ scope.row.name }}</div>
                    <div class="book-count">
                      <el-tag size="small" type="info">
                        {{ getBookCount(scope.row.name) }} 本图书
                      </el-tag>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button 
              v-if="canManageCategories"
              size="mini" 
              type="primary" 
              icon="el-icon-edit"
              plain
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              v-if="canManageCategories"
              size="mini" 
              type="danger"
              icon="el-icon-delete"
              plain
              @click="handleDelete(scope.row)"
              :disabled="getBookCount(scope.row.name) > 0"
            >删除</el-button>
            <span v-else class="no-permission">无权限</span>
          </template>
        </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredCategories.length"
            >
            </el-pagination>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：分类统计图表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stats-card">
          <div slot="header">
            <span>分类统计</span>
          </div>
          <div class="category-stats">
            <div v-for="category in categoryStats" :key="category.name" class="stat-item">
              <div class="stat-info">
                <span class="stat-name">{{ category.name }}</span>
                <span class="stat-count">{{ category.count }}本</span>
              </div>
              <el-progress 
                :percentage="category.percentage" 
                :color="category.color"
                :show-text="false"
              ></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类表单对话框：用于添加和编辑分类 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="categoryForm" 
        :rules="rules" 
        ref="categoryForm" 
        label-width="100px"
        :status-icon="true"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称"></el-input>
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
  name: 'CategoryList',
  data() {
    // 分类名称验证函数：检查分类名称是否已存在
    const validateCategoryName = (rule, value, callback) => {
      if (this.editingCategoryId) {
        // 编辑模式：排除当前编辑项
        const exists = this.categories.some(
          c => c.id !== this.editingCategoryId && c.name === value
        )
        if (exists) {
          callback(new Error('分类名称已存在'))
        } else {
          callback()
        }
      } else {
        // 新增模式：直接检查是否存在
        const exists = this.categories.some(c => c.name === value)
        if (exists) {
          callback(new Error('分类名称已存在'))
        } else {
          callback()
        }
      }
    }

    return {
      searchQuery: '',        // 搜索关键词
      dialogVisible: false,   // 对话框显示状态
      dialogTitle: '',        // 对话框标题
      loading: false,         // 加载状态
      submitting: false,      // 提交状态
      currentPage: 1,         // 当前页码
      pageSize: 10,          // 每页显示数量
      categoryForm: {         // 分类表单数据
        name: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { validator: validateCategoryName, trigger: 'blur' }
        ]
      },
      editingCategoryId: null,    // 正在编辑的分类ID
      colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']  // 分类统计图表的颜色配置
    }
  },

  computed: {
    // 从 store 获取分类列表
    categories() {
      return this.$store.state.categories
    },
    // 从 store 获取图书列表
    books() {
      return this.$store.state.books
    },
    // 从 store 获取当前用户
    currentUser() {
      return this.$store.state.currentUser
    },
    // 判断是否有分类管理权限
    canManageCategories() {
      if (!this.currentUser) return false
      return this.currentUser.role === 'admin' || 
             this.currentUser.role === 'librarian' ||
             (this.currentUser.permissions && this.currentUser.permissions.manageCategories)
    },
    // 根据搜索关键词过滤分类列表
    filteredCategories() {
      if (!this.searchQuery) return this.categories
      const query = this.searchQuery.toLowerCase()
      return this.categories.filter(category => 
        category.name.toLowerCase().includes(query)
      )
    },
    // 计算分类统计数据：包含每个分类的图书数量和占比
    categoryStats() {
      return this.categories.map((category, index) => {
        const count = this.getBookCount(category.name)
        const percentage = this.books.length ? (count / this.books.length) * 100 : 0
        return {
          name: category.name,
          count,
          percentage: Math.round(percentage),
          color: this.colors[index % this.colors.length]
        }
      }).sort((a, b) => b.count - a.count)
    }
  },

  methods: {
    // 检查操作权限
    checkPermission() {
      if (!this.canManageCategories) {
        this.$message.warning('您没有分类管理权限')
        return false
      }
      return true
    },
    // 获取指定分类下的图书数量
    getBookCount(categoryName) {
      return this.books.filter(book => book.category === categoryName).length
    },
    // 搜索处理：重置页码
    handleSearch() {
      this.currentPage = 1
    },
    // 每页显示数量变化处理
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    // 页码变化处理
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 添加分类：初始化表单
    handleAdd() {
      if (!this.checkPermission()) return
      
      this.dialogTitle = '添加分类'
      this.editingCategoryId = null
      this.categoryForm = { name: '' }
      this.dialogVisible = true
    },
    // 编辑分类：填充表单数据
    handleEdit(category) {
      if (!this.checkPermission()) return
      
      this.dialogTitle = '编辑分类'
      this.editingCategoryId = category.id
      this.categoryForm = { ...category }
      this.dialogVisible = true
    },
    // 删除分类：检查是否可删除并确认
    handleDelete(category) {
      if (!this.checkPermission()) return
      
      // 检查分类下是否有图书
      if (this.getBookCount(category.name) > 0) {
        this.$message.warning('该分类下还有图书，无法删除')
        return
      }
      
      // 确认删除
      this.$confirm('确认删除该分类吗？此操作不可恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        setTimeout(() => {
          this.$store.commit('deleteCategory', category.id)
          this.$message.success('删除成功')
          this.loading = false
        }, 500)
      }).catch(() => {})
    },
    // 提交表单：新增或更新分类
    handleSubmit() {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          this.submitting = true
          setTimeout(() => {
            if (this.editingCategoryId) {
              // 更新已有分类
              this.$store.commit('updateCategory', {
                id: this.editingCategoryId,
                ...this.categoryForm
              })
              this.$message.success('更新成功')
            } else {
              // 添加新分类
              this.$store.commit('addCategory', this.categoryForm)
              this.$message.success('添加成功')
            }
            this.submitting = false
            this.dialogVisible = false
          }, 500)
        }
      })
    }
  }
}
</script>

<style scoped>
.categories-container {
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

.category-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.category-icon {
  width: 40px;
  height: 40px;
  background-color: #f0f2f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon i {
  font-size: 24px;
  color: #409EFF;
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category-name {
  font-weight: bold;
  color: #303133;
}

.book-count {
  font-size: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.stats-card {
  height: 100%;
}

.category-stats {
  padding: 10px;
}

.stat-item {
  margin-bottom: 20px;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.stat-name {
  color: #606266;
}

.stat-count {
  color: #909399;
  font-size: 13px;
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

.category-icon {
  transition: all 0.3s;
}

.category-info:hover .category-icon {
  transform: scale(1.1);
}

.stat-item {
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateX(5px);
}
</style>