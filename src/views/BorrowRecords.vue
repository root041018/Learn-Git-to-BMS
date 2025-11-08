<template>
  <div class="borrow-records-container">
    <div class="page-header">
      <h2>借阅记录管理</h2>
      <el-button 
        v-if="canManageBorrowRecords"
        type="primary" 
        @click="handleBorrowBook" 
        class="borrow-btn"
      >
        <i class="el-icon-circle-plus-outline"></i> 借阅图书
      </el-button>
    </div>
    
    <!-- 过滤条件 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input 
            v-model="filterForm.bookName" 
            placeholder="请输入图书名称"
            prefix-icon="el-icon-search">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input 
            v-model="filterForm.username" 
            placeholder="请输入用户名"
            prefix-icon="el-icon-user">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterForm.status" placeholder="借阅状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="借阅中" value="borrowed"></el-option>
            <el-option label="已归还" value="returned"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    
    <!-- 借阅记录表格 -->
    <el-table 
      :data="filteredRecords" 
      style="width: 100%"
      border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="book.name" label="图书名称" width="200"></el-table-column>
      <el-table-column prop="user.username" label="借阅人" width="150"></el-table-column>
      <el-table-column prop="borrowDate" label="借阅日期" width="200" :formatter="formatDate"></el-table-column>
      <el-table-column prop="returnDate" label="归还日期" width="200" :formatter="formatDate"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'borrowed'" type="warning">借阅中</el-tag>
          <el-tag v-else-if="scope.row.status === 'returned'" type="success">已归还</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.remark || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button 
              v-if="canManageBorrowRecords && scope.row.status === 'borrowed'" 
              type="primary" 
              size="small" 
              @click="handleReturnBook(scope.row.id)"
            >
              归还
            </el-button>
            <el-button 
              v-if="canManageBorrowRecords"
              type="danger" 
              size="small" 
              @click="handleDeleteRecord(scope.row.id)"
            >
              删除
            </el-button>
            <span v-else class="no-permission">无权限</span>
          </template>
        </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    
    <!-- 借阅图书对话框 -->
    <el-dialog 
      title="借阅图书" 
      :visible.sync="borrowDialogVisible"
      width="500px">
      <el-form 
        :model="borrowForm" 
        ref="borrowForm"
        :rules="borrowRules" 
        label-width="100px">
        <el-form-item label="用户" prop="userId">
          <el-select v-model="borrowForm.userId" placeholder="请选择用户">
            <el-option 
              v-for="user in users" 
              :key="user.id" 
              :label="user.username" 
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图书" prop="bookId">
          <el-select v-model="borrowForm.bookId" placeholder="请选择图书">
            <el-option 
              v-for="book in availableBooks" 
              :key="book.id" 
              :label="book.name" 
              :value="book.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="borrowForm.remark" placeholder="可选备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="borrowDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBorrow">确认借阅</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BorrowRecords',
  data() {
    return {
      // 过滤表单
      filterForm: {
        bookName: '',
        username: '',
        status: ''
      },
      // 借阅表单
      borrowForm: {
        userId: '',
        bookId: '',
        remark: ''
      },
      // 借阅表单验证规则
      borrowRules: {
        userId: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        bookId: [
          { required: true, message: '请选择图书', trigger: 'change' }
        ]
      },
      // 对话框状态
      borrowDialogVisible: false,
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0
    };
  },
  computed: {
    // 获取当前用户
    currentUser() {
      return this.$store.state.currentUser;
    },
    // 判断是否有借阅记录管理权限
    canManageBorrowRecords() {
      if (!this.currentUser) return false
      return this.currentUser.role === 'admin' || 
             this.currentUser.role === 'librarian' ||
             (this.currentUser.permissions && this.currentUser.permissions.manageBorrowRecords)
    },
    // 获取所有用户
    users() {
      return this.$store.state.users;
    },
    // 获取所有图书
    allBooks() {
      return this.$store.state.books;
    },
    // 获取可借阅的图书（库存大于0且没有被当前用户借阅）
    availableBooks() {
      // 找出所有已借出但未归还的图书ID
      const borrowedBookIds = this.$store.state.borrowRecords
        .filter(record => record.status === 'borrowed')
        .map(record => record.bookId);
      
      // 返回库存大于0且未被借出的图书
      return this.allBooks.filter(book => 
        book.stock > 0 && !borrowedBookIds.includes(book.id)
      );
    },
    // 获取所有借阅记录并关联图书和用户信息
    allRecords() {
      return this.$store.state.borrowRecords.map(record => {
        const book = this.allBooks.find(b => b.id === record.bookId);
        const user = this.users.find(u => u.id === record.userId);
        return {
          ...record,
          book: book || {},
          user: user || {}
        };
      });
    },
    // 过滤后的借阅记录
    filteredRecords() {
      let records = [...this.allRecords];
      
      // 按图书名称过滤
      if (this.filterForm.bookName) {
        records = records.filter(record => 
          record.book.name && record.book.name.includes(this.filterForm.bookName)
        );
      }
      
      // 按用户名过滤
      if (this.filterForm.username) {
        records = records.filter(record => 
          record.user.username && record.user.username.includes(this.filterForm.username)
        );
      }
      
      // 按状态过滤
      if (this.filterForm.status) {
        records = records.filter(record => record.status === this.filterForm.status);
      }
      
      // 更新总条数
      this.totalRecords = records.length;
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return records.slice(startIndex, startIndex + this.pageSize);
    }
  },
  methods: {
    // 检查操作权限
    checkPermission() {
      if (!this.canManageBorrowRecords) {
        this.$message.warning('您没有借阅记录管理权限')
        return false
      }
      return true
    },
    // 格式化日期
    formatDate(row, column, cellValue) {
      if (!cellValue) return '--';
      const date = new Date(cellValue);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    // 打开借阅对话框
    handleBorrowBook() {
      if (!this.checkPermission()) return
      
      this.borrowForm = {
        userId: '',
        bookId: '',
        remark: ''
      };
      this.borrowDialogVisible = true;
    },
    
    // 确认借阅
    confirmBorrow() {
      if (!this.checkPermission()) {
        this.borrowDialogVisible = false
        return
      }
      
      this.$refs.borrowForm.validate(valid => {
        if (valid) {
          // 创建借阅记录
          const borrowRecord = {
            userId: this.borrowForm.userId,
            bookId: this.borrowForm.bookId,
            remark: this.borrowForm.remark
          };
          
          // 添加借阅记录
          this.$store.commit('addBorrowRecord', borrowRecord);
          
          // 更新图书库存
          const book = this.allBooks.find(b => b.id === this.borrowForm.bookId);
          if (book) {
            const updatedBook = { ...book, stock: book.stock - 1 };
            this.$store.commit('updateBook', updatedBook);
          }
          
          this.$message.success('借阅成功');
          this.borrowDialogVisible = false;
        }
      });
    },
    
    // 归还图书
    handleReturnBook(recordId) {
      if (!this.checkPermission()) return
      
      this.$confirm('确定要归还这本书吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 更新借阅记录状态
        this.$store.commit('returnBook', recordId);
        
        // 获取对应的借阅记录
        const record = this.$store.state.borrowRecords.find(r => r.id === recordId);
        if (record) {
          // 更新图书库存
          const book = this.allBooks.find(b => b.id === record.bookId);
          if (book) {
            const updatedBook = { ...book, stock: book.stock + 1 };
            this.$store.commit('updateBook', updatedBook);
          }
        }
        
        this.$message.success('归还成功');
      }).catch(() => {
        this.$message.info('已取消归还');
      });
    },
    
    // 删除借阅记录
    handleDeleteRecord(recordId) {
      if (!this.checkPermission()) return
      
      this.$confirm('确定要删除这条借阅记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取对应的借阅记录
        const record = this.$store.state.borrowRecords.find(r => r.id === recordId);
        if (record && record.status === 'borrowed') {
          // 如果图书未归还，先恢复库存
          const book = this.allBooks.find(b => b.id === record.bookId);
          if (book) {
            const updatedBook = { ...book, stock: book.stock + 1 };
            this.$store.commit('updateBook', updatedBook);
          }
        }
        
        // 删除借阅记录
        this.$store.commit('deleteBorrowRecord', recordId);
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    // 查询
    handleSearch() {
      this.currentPage = 1; // 重置到第一页
    },
    
    // 重置
    handleReset() {
      this.filterForm = {
        bookName: '',
        username: '',
        status: ''
      };
      this.currentPage = 1;
    },
    
    // 分页大小改变
    handleSizeChange(size) {
      this.pageSize = size;
    },
    
    // 当前页改变
    handleCurrentChange(current) {
      this.currentPage = current;
    }
  }
};
</script>

<style scoped>
.borrow-records-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: calc(100vh - 100px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.borrow-btn {
  background-color: #409eff;
  border-color: #409eff;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .borrow-btn {
    margin-top: 10px;
    width: 100%;
  }
  
  .filter-section .el-row {
    flex-direction: column;
  }
  
  .filter-section .el-col {
    width: 100% !important;
    margin-bottom: 10px;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>