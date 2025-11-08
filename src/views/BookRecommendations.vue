<template>
  <div class="book-recommendations-container">
    <div class="page-header">
      <h2>为您推荐</h2>
      <div class="header-actions">
        <el-select v-model="recommendationType" @change="handleRecommendationTypeChange">
          <el-option label="个性化推荐" value="personalized"></el-option>
          <el-option label="热门图书" value="popular"></el-option>
          <el-option label="分类精选" value="category"></el-option>
        </el-select>
        <el-button type="primary" @click="refreshRecommendations" class="refresh-btn">
          <i class="el-icon-refresh"></i> 刷新推荐
        </el-button>
      </div>
    </div>
    
    <!-- 分类选择（当选择分类精选时显示） -->
    <div v-if="recommendationType === 'category'" class="category-selection">
      <el-select 
        v-model="selectedCategoryId" 
        placeholder="请选择分类"
        @change="handleCategoryChange">
        <el-option 
          v-for="category in categories" 
          :key="category.id" 
          :label="category.name" 
          :value="category.id">
        </el-option>
      </el-select>
    </div>
    
    <!-- 推荐理由 -->
    <div class="recommendation-reason">
      <el-tag type="info" v-if="recommendationType === 'personalized'">{{ reasonText }}</el-tag>
    </div>
    
    <!-- 推荐图书列表 -->
    <div class="recommendation-results" v-if="recommendedBooks.length > 0">
      <el-row :gutter="20">
        <el-col 
          v-for="(book, index) in recommendedBooks" 
          :key="book.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6" 
          :xl="4">
          <el-card 
            :body-style="{ padding: '15px' }"
            class="book-card"
            :class="{ 'top-recommendation': index < 3 }">
            <div class="book-rank" v-if="index < 3">
              <span class="rank-number">{{ index + 1 }}</span>
            </div>
            <div class="book-cover">
              <div class="cover-placeholder">
                <div class="cover-placeholder-icon">
                  <i class="el-icon-document"></i>
                </div>
                <div class="cover-placeholder-title">{{ book.name }}</div>
              </div>
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.name }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <p class="book-publisher">{{ book.publisher }} · {{ book.publishYear }}</p>
              <div class="book-meta">
                  <span class="book-category">{{ book.category || '未知分类' }}</span>
                  <span class="book-isbn">{{ book.isbn }}</span>
                </div>
              <div class="book-stats">
                <div class="stat-item">
                  <i class="el-icon-star-on"></i>
                  <span>{{ getBookRating(book.id) }}分</span>
                </div>
                <div class="stat-item">
                  <i class="el-icon-document"></i>
                  <span>{{ getBorrowCount(book.id) }}次借阅</span>
                </div>
              </div>
              <div class="book-actions">
                <el-button 
                  type="primary" 
                  size="small" 
                  :disabled="!canBorrow(book.id)"
                  @click="handleBorrow(book.id)">
                  {{ canBorrow(book.id) ? '立即借阅' : '已借出' }}
                </el-button>
                <el-button 
                  size="small" 
                  @click="showSimilarBooks(book.id)">
                  相似图书
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 无推荐结果时显示 -->
    <div v-else class="no-results">
      <el-empty description="暂无推荐图书"></el-empty>
    </div>
    
    <!-- 相似图书对话框 -->
    <el-dialog 
      title="相似图书推荐" 
      :visible.sync="similarBooksDialogVisible"
      width="800px">
      <div v-if="similarBooks.length > 0">
        <el-row :gutter="20">
          <el-col 
            v-for="book in similarBooks" 
            :key="book.id" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6">
            <el-card 
              :body-style="{ padding: '10px' }"
              class="similar-book-card">
              <div class="similar-book-info">
                <h4 class="similar-book-title">{{ book.name }}</h4>
                <p class="similar-book-author">{{ book.author }}</p>
                <div class="similarity-score">
                  <span>相似度: {{ Math.round(book.similarity) }}%</span>
                </div>
                <el-button 
                  type="text" 
                  size="small" 
                  :disabled="!canBorrow(book.id)"
                  @click="handleBorrow(book.id)">
                  {{ canBorrow(book.id) ? '立即借阅' : '已借出' }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <el-empty description="暂无相似图书"></el-empty>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="similarBooksDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BookRecommendationService from '../services/BookRecommendationService';

export default {
  name: 'BookRecommendations',
  data() {
    return {
      // 推荐类型：个性化推荐、热门图书、分类精选
      recommendationType: 'personalized',
      // 选中的分类ID
      selectedCategoryId: '',
      // 推荐图书列表
      recommendedBooks: [],
      // 相似图书列表
      similarBooks: [],
      // 对话框状态
      similarBooksDialogVisible: false,
      // 推荐理由
      reasonText: '',
      // 推荐服务实例
      recommendationService: null
    };
  },
  computed: {
    // 获取当前用户
    currentUser() {
      return this.$store.state.currentUser;
    },
    // 获取所有图书
    books() {
      return this.$store.state.books;
    },
    // 获取所有分类
    categories() {
      return this.$store.state.categories;
    },
    // 获取所有借阅记录
    borrowRecords() {
      return this.$store.state.borrowRecords;
    }
  },
  created() {
    // 初始化推荐服务
    this.recommendationService = new BookRecommendationService(this.books, this.borrowRecords, this.categories);
    // 获取推荐图书
    this.getRecommendations();
  },
  methods: {
    // 获取推荐图书
    getRecommendations() {
      // 更新推荐服务的数据
      this.recommendationService.updateData(this.books, this.borrowRecords, this.categories);
      
      // 根据推荐类型获取推荐图书
      switch (this.recommendationType) {
        case 'personalized':
          this.getPersonalizedRecommendations();
          break;
        case 'popular':
          this.getPopularRecommendations();
          break;
        case 'category':
          this.getCategoryRecommendations();
          break;
        default:
          this.getPersonalizedRecommendations();
      }
    },
    
    // 获取个性化推荐
    getPersonalizedRecommendations() {
      if (!this.currentUser) {
        this.recommendedBooks = [];
        this.reasonText = '';
        return;
      }
      
      // 获取个性化推荐
      this.recommendedBooks = this.recommendationService.getRecommendationsForUser(this.currentUser.id, 12);
      
      // 根据用户的借阅历史生成推荐理由
      const userBorrowedBookIds = this.recommendationService.getUserBorrowHistory(this.currentUser.id);
      const userBorrowedBooks = this.books.filter(book => userBorrowedBookIds.includes(book.id));
      
      if (userBorrowedBooks.length > 0) {
        // 统计用户最喜欢的分类
        const categoryCount = {};
        userBorrowedBooks.forEach(book => {
          categoryCount[book.categoryId] = (categoryCount[book.categoryId] || 0) + 1;
        });
        
        // 获取借阅最多的分类
        const mostBorrowedCategoryId = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])[0][0];
        const mostBorrowedCategory = this.categories.find(c => c.id === parseInt(mostBorrowedCategoryId));
        
        // 生成推荐理由
        if (mostBorrowedCategory) {
          this.reasonText = `基于您对${mostBorrowedCategory.name}类图书的偏好`;
        } else {
          this.reasonText = '基于您的借阅历史';
        }
      } else {
        // 如果用户没有借阅历史，显示热门图书并生成相应理由
        this.recommendedBooks = this.recommendationService.getPopularBooks(12);
        this.reasonText = '根据大多数读者的选择';
      }
    },
    
    // 获取热门推荐
    getPopularRecommendations() {
      this.recommendedBooks = this.recommendationService.getPopularBooks(12);
      this.reasonText = '';
    },
    
    // 获取分类推荐
    getCategoryRecommendations() {
      if (this.selectedCategoryId) {
        this.recommendedBooks = this.recommendationService.getRecommendationsByCategory(this.selectedCategoryId, 12);
      } else {
        this.recommendedBooks = [];
      }
      this.reasonText = '';
    },
    
    // 处理推荐类型变更
    handleRecommendationTypeChange() {
      this.getRecommendations();
    },
    
    // 处理分类变更
    handleCategoryChange() {
      this.getRecommendations();
    },
    
    // 刷新推荐
    refreshRecommendations() {
      this.getRecommendations();
      this.$message.success('推荐已更新');
    },
    
    // 获取图书封面图（使用本地样式替代外部图片服务）
    getBookCover(book) {
      // 移除外部占位图服务依赖，返回空字符串
      // 将在CSS中使用动态生成的背景样式代替图片
      return '';
    },
    
    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '未知分类';
    },
    
    // 获取图书评分（这里简化处理，实际项目中可以添加评分系统）
    getBookRating(bookId) {
      // 简单模拟评分，实际项目中应该从数据库获取
      const borrowCount = this.getBorrowCount(bookId);
      return borrowCount > 0 ? (4 + Math.random()).toFixed(1) : '暂无';
    },
    
    // 获取图书借阅次数
    getBorrowCount(bookId) {
      return this.borrowRecords.filter(record => record.bookId === bookId).length;
    },
    
    // 判断图书是否可借阅
    canBorrow(bookId) {
      const book = this.books.find(b => b.id === bookId);
      if (!book || book.stock <= 0) {
        return false;
      }
      
      // 检查是否已被借出
      const borrowedCount = this.borrowRecords.filter(
        record => record.bookId === bookId && record.status === 'borrowed'
      ).length;
      
      return borrowedCount < book.stock;
    },
    
    // 处理借阅
    handleBorrow(bookId) {
      if (!this.currentUser) {
        this.$message.warning('请先登录');
        this.$router.push('/login');
        return;
      }
      
      // 创建借阅记录
      const borrowRecord = {
        userId: this.currentUser.id,
        bookId: bookId,
        remark: 'AI推荐借阅'
      };
      
      // 添加借阅记录
      this.$store.commit('addBorrowRecord', borrowRecord);
      
      // 更新图书库存
      const book = this.books.find(b => b.id === bookId);
      if (book) {
        const updatedBook = { ...book, stock: book.stock - 1 };
        this.$store.commit('updateBook', updatedBook);
      }
      
      this.$message.success('借阅成功');
      // 刷新推荐列表
      this.getRecommendations();
    },
    
    // 显示相似图书
    showSimilarBooks(bookId) {
      this.similarBooks = this.recommendationService.getSimilarBooks(bookId, 8);
      this.similarBooksDialogVisible = true;
    }
  }
};
</script>

<style scoped>
.book-recommendations-container {
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

.header-actions {
  display: flex;
  align-items: center;
}

.refresh-btn {
  margin-left: 10px;
}

.category-selection {
  margin-bottom: 20px;
}

.recommendation-reason {
  margin-bottom: 20px;
}

.recommendation-results {
  margin-top: 20px;
}

.book-card {
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.top-recommendation {
  border: 2px solid #409eff;
}

.book-rank {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #409eff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.book-cover {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  width: 120px;
  height: 180px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 4px;
  background-color: #f0f2f5;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
  background-color: #f0f2f5;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.cover-placeholder-icon {
  font-size: 32px;
  color: #c0c4cc;
  margin-bottom: 10px;
}

.cover-placeholder-title {
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.book-info {
  text-align: center;
}

.book-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  color: #666;
  margin-bottom: 4px;
}

.book-publisher {
  color: #999;
  font-size: 12px;
  margin-bottom: 8px;
}

.book-meta {
  margin-bottom: 10px;
}

.book-category {
  display: inline-block;
  background-color: #f0f9ff;
  color: #0366d6;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 8px;
}

.book-isbn {
  color: #999;
  font-size: 11px;
}

.book-stats {
  margin-bottom: 15px;
  font-size: 12px;
}

.stat-item {
  margin-bottom: 4px;
  color: #666;
}

.stat-item i {
  color: #409eff;
  margin-right: 4px;
}

.book-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.no-results {
  padding: 60px 0;
  text-align: center;
}

.similar-book-card {
  height: 100%;
}

.similar-book-info {
  text-align: center;
}

.similar-book-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-book-author {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.similarity-score {
  color: #409eff;
  font-size: 11px;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    margin-top: 10px;
  }
  
  .refresh-btn {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
}
</style>