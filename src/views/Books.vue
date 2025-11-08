/**
 * 图书管理组件
 * 实现图书的增删改查功能
 */

<template>
  <!-- 页面容器 -->
  <div class="books-container">
    <!-- 页面头部：标题和操作按钮 -->
    <div class="page-header">
      <h2>图书管理</h2>
      <!-- 搜索和添加按钮 -->
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索图书名称"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
          class="search-input"
        ></el-input>
        <el-button 
          v-if="canManageBooks"
          type="primary" 
          icon="el-icon-plus" 
          @click="handleAdd"
        >添加图书</el-button>
      </div>
    </div>

    <!-- 图书列表 -->
    <el-card shadow="hover" class="table-card">
      <el-table 
        :data="paginatedBooks" 
        border 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column label="图书信息" min-width="300">
          <template slot-scope="scope">
            <div class="book-info">
              <div class="book-cover">
                <i class="el-icon-reading"></i>
              </div>
              <div class="book-details">
                <div class="book-name">{{ scope.row.name }}</div>
                <div class="book-category">
                  <el-tag size="small" :type="getTagType(scope.row.category)">
                    {{ scope.row.category }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button 
              v-if="canManageBooks"
              size="mini" 
              type="primary" 
              icon="el-icon-edit" 
              plain 
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button 
              v-if="canManageBooks"
              size="mini" 
              type="danger" 
              icon="el-icon-delete" 
              plain 
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <span v-else class="no-permission">无权限</span>
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
          :total="filteredBooks.length"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 图书表单对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="bookForm" 
        :rules="rules" 
        ref="bookForm" 
        label-width="100px"
        :status-icon="true"
      >
        <el-form-item label="图书名称" prop="name">
          <el-input v-model="bookForm.name" placeholder="请输入图书名称"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="bookForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.name"
              :label="category.name"
              :value="category.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="bookForm.price" 
            :precision="2" 
            :step="0.1" 
            :min="0"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="bookForm.description" 
            :rows="3"
            placeholder="请输入图书描述"
          ></el-input>
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
  name: 'BookList',
  data() {
    return {
      searchQuery: '',        // 搜索关键词
      dialogVisible: false,   // 对话框显示状态
      dialogTitle: '',        // 对话框标题
      loading: false,         // 加载状态
      submitting: false,      // 提交状态
      currentPage: 1,         // 当前页码
      pageSize: 10,          // 每页显示数量
      bookForm: {            // 图书表单数据
        name: '',
        category: '',
        price: 0,
        description: ''
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入图书名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        description: [
          { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
        ]
      },
      editingBookId: null    // 正在编辑的图书ID
    }
  },
  computed: {
    books() {
      return this.$store.state.books
    },
    categories() {
      return this.$store.state.categories
    },
    currentUser() {
      return this.$store.state.currentUser
    },
    // 判断是否有图书管理权限
    canManageBooks() {
      if (!this.currentUser) return false
      return this.currentUser.role === 'admin' || 
             this.currentUser.role === 'librarian' ||
             (this.currentUser.permissions && this.currentUser.permissions.manageBooks)
    },
    filteredBooks() {
      if (!this.searchQuery) return this.books
      const query = this.searchQuery.toLowerCase()
      return this.books.filter(book => 
        book.name.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      )
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBooks.slice(start, end)
    }
  },
  methods: {
    // 检查操作权限
    checkPermission() {
      if (!this.canManageBooks) {
        this.$message.warning('您没有图书管理权限')
        return false
      }
      return true
    },
    getTagType(category) {
      const types = ['', 'success', 'warning', 'danger', 'info']
      const index = this.categories.findIndex(c => c.name === category)
      return types[index % types.length]
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
    handleAdd() {
      if (!this.checkPermission()) return
      
      this.dialogTitle = '添加图书'
      this.editingBookId = null
      this.bookForm = {
        name: '',
        category: '',
        price: 0,
        description: ''
      }
      this.dialogVisible = true
    },
    handleEdit(book) {
      if (!this.checkPermission()) return
      
      this.dialogTitle = '编辑图书'
      this.editingBookId = book.id
      this.bookForm = { ...book }
      this.dialogVisible = true
    },
    handleDelete(book) {
      if (!this.checkPermission()) return
      
      this.$confirm('确认删除该图书吗？此操作不可恢复', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        setTimeout(() => {
          this.$store.commit('deleteBook', book.id)
          this.$message.success('删除成功')
          this.loading = false
        }, 500)
      }).catch(() => {})
    },
    handleSubmit() {
      this.$refs.bookForm.validate(valid => {
        if (valid) {
          this.submitting = true
          setTimeout(() => {
            if (this.editingBookId) {
              this.$store.commit('updateBook', {
                id: this.editingBookId,
                ...this.bookForm
              })
              this.$message.success('更新成功')
            } else {
              this.$store.commit('addBook', this.bookForm)
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
.books-container {
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

.book-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.book-cover {
  width: 40px;
  height: 40px;
  background-color: #f0f2f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-cover i {
  font-size: 24px;
  color: #409EFF;
}

.book-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.book-name {
  font-weight: bold;
  color: #303133;
}

.book-category {
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

.book-cover {
  transition: all 0.3s;
}

.book-info:hover .book-cover {
  transform: scale(1.1);
}
</style>