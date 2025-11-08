/**
 * 仪表盘组件
 * 展示系统概览信息和统计数据
 * 包含图书、分类、用户等统计信息
 */

<template>
  <div class="dashboard-container">
    <!-- 欢迎信息区域 -->
    <div class="welcome-section">
      <h2>欢迎使用图书管理系统</h2>
      <p class="time">{{ currentTime }}</p>
    </div>

    <!-- 数据统计卡片区域 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-reading"></i>
            <span>图书总数</span>
          </div>
          <div class="data-content">
            <span class="number">{{ books.length }}</span>
            <span class="unit">本</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-collection"></i>
            <span>分类总数</span>
          </div>
          <div class="data-content">
            <span class="number">{{ categories.length }}</span>
            <span class="unit">个</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-user"></i>
            <span>用户总数</span>
          </div>
          <div class="data-content">
            <span class="number">{{ users.length }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-document"></i>
            <span>总借阅次数</span>
          </div>
          <div class="data-content">
            <span class="number">{{ totalBorrowCount }}</span>
            <span class="unit">次</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-refresh"></i>
            <span>当前借出</span>
          </div>
          <div class="data-content">
            <span class="number">{{ currentBorrowedCount }}</span>
            <span class="unit">本</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表统计区域 -->
    <el-row :gutter="20" class="charts-section">
      <!-- 分类统计图表 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header">
            <span>图书分类统计</span>
          </div>
          <div class="category-list">
            <div v-for="category in categoryStats" :key="category.name" class="category-item">
              <span class="category-name">{{ category.name }}</span>
              <el-progress 
                :percentage="category.percentage" 
                :color="category.color"
                :show-text="false"
              ></el-progress>
              <span class="category-count">{{ category.count }}本</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 最受欢迎图书 -->
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header">
            <span>最受欢迎图书</span>
          </div>
          <el-table :data="popularBooks" style="width: 100%">
            <el-table-column prop="name" label="图书名称" width="200"></el-table-column>
            <el-table-column prop="count" label="借阅次数" width="120"></el-table-column>
            <el-table-column label="热度指数">
              <template slot-scope="scope">
                <el-rate 
                  v-model="scope.row.count" 
                  :max="5" 
                  disabled 
                  :show-score="false">
                </el-rate>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 借阅达人 -->
      <el-col :span="24">
        <el-card shadow="hover" class="chart-card">
          <div slot="header">
            <span>借阅达人</span>
          </div>
          <el-table :data="topBorrowers" style="width: 100%">
            <el-table-column prop="username" label="用户名称" width="150"></el-table-column>
            <el-table-column prop="count" label="借阅次数" width="120"></el-table-column>
            <el-table-column label="等级">
              <template slot-scope="scope">
                <el-tag 
                  :type="getBorrowerLevel(scope.row.count)"
                  size="small">
                  {{ getBorrowerLevelText(scope.row.count) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      currentTime: '',        // 当前时间
      colors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
    }
  },
  computed: {
    books() {
      return this.$store.state.books
    },
    categories() {
      return this.$store.state.categories
    },
    users() {
      return this.$store.state.users
    },
    // 获取借阅记录
    borrowRecords() {
      return this.$store.state.borrowRecords || []
    },
    // 总借阅次数
    totalBorrowCount() {
      return this.borrowRecords.length
    },
    // 当前借出图书数量
    currentBorrowedCount() {
      return this.borrowRecords.filter(record => record.status === 'borrowed').length
    },
    // 最受欢迎的图书（借阅次数最多的前5本）
    popularBooks() {
      const bookCountMap = {}
      
      // 统计每本书的借阅次数
      this.borrowRecords.forEach(record => {
        bookCountMap[record.bookId] = (bookCountMap[record.bookId] || 0) + 1
      })
      
      // 转换为数组并排序
      const sortedBooks = Object.entries(bookCountMap)
        .map(([bookId, count]) => {
          const book = this.books.find(b => b.id === parseInt(bookId))
          return {
            id: bookId,
            name: book ? book.name : '未知图书',
            count: count
          }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      
      return sortedBooks
    },
    // 借阅次数最多的用户（前5名）
    topBorrowers() {
      const userCountMap = {}
      
      // 统计每个用户的借阅次数
      this.borrowRecords.forEach(record => {
        userCountMap[record.userId] = (userCountMap[record.userId] || 0) + 1
      })
      
      // 转换为数组并排序
      const sortedUsers = Object.entries(userCountMap)
        .map(([userId, count]) => {
          const user = this.users.find(u => u.id === parseInt(userId))
          return {
            id: userId,
            username: user ? user.username : '未知用户',
            count: count
          }
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
      
      return sortedUsers
    },
    // 计算分类统计数据
    categoryStats() {
      const stats = this.categories.map((category, index) => {
        const count = this.books.filter(book => book.category === category.name).length
        const percentage = this.books.length ? (count / this.books.length) * 100 : 0
        return {
          name: category.name,
          count,
          percentage: Math.round(percentage),
          color: this.colors[index % this.colors.length]
        }
      })
      return stats.sort((a, b) => b.count - a.count)
    },
    // 获取最新添加的5本书
    latestBooks() {
      return [...this.books]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
    }
  },
  methods: {
    updateTime() {
      const now = new Date()
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
      this.currentTime = now.toLocaleDateString('zh-CN', options)
    },
    getTagType(category) {
      const types = ['', 'success', 'warning', 'danger', 'info']
      const index = this.categories.findIndex(c => c.name === category)
      return types[index % types.length]
    },
    
    // 获取借阅达人等级标签类型
    getBorrowerLevel(count) {
      if (count >= 10) return 'danger'
      if (count >= 5) return 'warning'
      return 'success'
    },
    
    // 获取借阅达人等级文本
    getBorrowerLevelText(count) {
      if (count >= 10) return '钻石读者'
      if (count >= 5) return '黄金读者'
      return '白银读者'
    }
  },
  created() {
    this.updateTime()
    // 每秒更新时间
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-section {
  margin-bottom: 30px;
  text-align: center;
}

.welcome-section h2 {
  color: #303133;
  margin-bottom: 10px;
}

.time {
  color: #909399;
  font-size: 14px;
}

.data-overview {
  margin-bottom: 30px;
}

.data-card {
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-5px);
}

.data-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.data-header i {
  font-size: 24px;
  margin-right: 10px;
  color: #409EFF;
}

.data-content {
  text-align: center;
}

.number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
}

.unit {
  font-size: 14px;
  color: #909399;
  margin-left: 5px;
}

.charts-section {
  margin-top: 20px;
}

.chart-card {
  min-height: 400px;
}

.category-list {
  padding: 10px;
}

.category-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.category-name {
  width: 80px;
  margin-right: 10px;
  color: #606266;
}

.category-count {
  width: 60px;
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
}

.el-progress {
  flex: 1;
}

.latest-books {
  min-height: 400px;
}

.el-table {
  background-color: transparent;
}

.el-card {
  border-radius: 8px;
}

.el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #EBEEF5;
  font-weight: bold;
  color: #303133;
}


</style>