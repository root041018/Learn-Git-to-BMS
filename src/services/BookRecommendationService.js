/**
 * 图书推荐服务
 * 基于用户的借阅历史、图书分类相似度等实现简单的协同过滤推荐算法
 */

export default class BookRecommendationService {
  /**
   * 初始化推荐服务
   * @param {Array} books - 图书列表
   * @param {Array} borrowRecords - 借阅记录列表
   * @param {Array} categories - 分类列表
   */
  constructor(books, borrowRecords, categories = []) {
    this.books = books || [];
    this.borrowRecords = borrowRecords || [];
    this.categories = categories || [];
  }

  /**
   * 更新数据
   * @param {Array} books - 图书列表
   * @param {Array} borrowRecords - 借阅记录列表
   * @param {Array} categories - 分类列表
   */
  updateData(books, borrowRecords, categories = []) {
    this.books = books || [];
    this.borrowRecords = borrowRecords || [];
    this.categories = categories || [];
  }

  /**
   * 获取用户的借阅历史
   * @param {Number} userId - 用户ID
   * @returns {Array} 借阅历史图书ID数组
   */
  getUserBorrowHistory(userId) {
    return this.borrowRecords
      .filter(record => record.userId === userId)
      .map(record => record.bookId);
  }

  /**
   * 计算图书之间的相似度
   * 基于图书的分类、作者、出版年份等进行简单相似度计算
   * @param {Object} book1 - 图书1
   * @param {Object} book2 - 图书2
   * @returns {Number} 相似度分数
   */
  calculateBookSimilarity(book1, book2) {
    let similarity = 0;
    
    // 分类相同，相似度+30
    if (book1.categoryId === book2.categoryId) {
      similarity += 30;
    }
    
    // 作者相同，相似度+25
    if (book1.author === book2.author) {
      similarity += 25;
    }
    
    // 出版年份相近（5年内），相似度+15
    if (book1.publishYear && book2.publishYear) {
      const yearDiff = Math.abs(book1.publishYear - book2.publishYear);
      if (yearDiff <= 5) {
        similarity += 15;
      }
    }
    
    // 出版社相同，相似度+10
    if (book1.publisher === book2.publisher) {
      similarity += 10;
    }
    
    // 图书类型相同，相似度+10
    if (book1.type === book2.type) {
      similarity += 10;
    }
    
    return similarity;
  }

  /**
   * 获取热门图书
   * @param {Number} count - 推荐数量
   * @returns {Array} 热门图书列表
   */
  getPopularBooks(count = 5) {
    // 统计每本书的借阅次数
    const bookCountMap = {};
    
    this.borrowRecords.forEach(record => {
      bookCountMap[record.bookId] = (bookCountMap[record.bookId] || 0) + 1;
    });
    
    // 转换为数组并排序
    const sortedBooks = Object.entries(bookCountMap)
      .map(([bookId, count]) => {
        const book = this.books.find(b => b.id === parseInt(bookId));
        return {
          ...book,
          borrowCount: count
        };
      })
      .filter(book => book) // 过滤掉已删除的图书
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, count);
    
    return sortedBooks;
  }

  /**
   * 获取用户可能喜欢的图书推荐
   * 基于协同过滤算法
   * @param {Number} userId - 用户ID
   * @param {Number} count - 推荐数量
   * @returns {Array} 推荐图书列表
   */
  getRecommendationsForUser(userId, count = 5) {
    // 获取用户的借阅历史
    const userBorrowedBookIds = this.getUserBorrowHistory(userId);
    
    // 如果用户没有借阅历史，返回热门图书
    if (userBorrowedBookIds.length === 0) {
      return this.getPopularBooks(count);
    }
    
    // 获取用户已借阅的图书详情
    const userBorrowedBooks = this.books.filter(book => 
      userBorrowedBookIds.includes(book.id)
    );
    
    // 计算每本未借阅图书的推荐分数
    const recommendationScores = {};
    
    this.books.forEach(book => {
      // 跳过用户已经借阅过的图书
      if (userBorrowedBookIds.includes(book.id)) {
        return;
      }
      
      // 计算与用户已借阅图书的相似度总和
      let totalSimilarity = 0;
      
      userBorrowedBooks.forEach(borrowedBook => {
        totalSimilarity += this.calculateBookSimilarity(book, borrowedBook);
      });
      
      // 计算平均相似度作为推荐分数
      const avgSimilarity = totalSimilarity / userBorrowedBooks.length;
      
      // 增加图书的热门程度作为额外分数
      const bookBorrowCount = this.borrowRecords.filter(r => r.bookId === book.id).length;
      const popularityScore = Math.min(bookBorrowCount * 2, 20); // 最多20分
      
      // 最终推荐分数
      recommendationScores[book.id] = avgSimilarity + popularityScore;
    });
    
    // 转换为数组并排序
    const sortedRecommendations = Object.entries(recommendationScores)
      .map(([bookId, score]) => {
        const book = this.books.find(b => b.id === parseInt(bookId));
        return {
          ...book,
          score: score
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
    
    return sortedRecommendations;
  }

  /**
   * 获取与指定图书相似的图书
   * @param {Number} bookId - 图书ID
   * @param {Number} count - 推荐数量
   * @returns {Array} 相似图书列表
   */
  getSimilarBooks(bookId, count = 5) {
    const targetBook = this.books.find(book => book.id === bookId);
    
    if (!targetBook) {
      return [];
    }
    
    // 计算与目标图书的相似度
    const similarityScores = this.books
      .filter(book => book.id !== bookId) // 排除自身
      .map(book => ({
        ...book,
        similarity: this.calculateBookSimilarity(targetBook, book)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count);
    
    return similarityScores;
  }

  /**
   * 获取基于分类的推荐图书
   * @param {Number} categoryId - 分类ID
   * @param {Number} count - 推荐数量
   * @returns {Array} 分类推荐图书列表
   */
  getRecommendationsByCategory(categoryId, count = 5) {
    // 首先找到对应的分类名称
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      return [];
    }
    
    // 获取该分类下的所有图书
    const categoryBooks = this.books.filter(book => book.category === category.name);
    
    // 按热门程度排序
    const sortedBooks = categoryBooks
      .map(book => {
        const borrowCount = this.borrowRecords.filter(r => r.bookId === book.id).length;
        return {
          ...book,
          borrowCount: borrowCount
        };
      })
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, count);
    
    return sortedBooks;
  }

  /**
   * 智能搜索图书
   * 根据关键词进行模糊匹配，并根据相关性排序
   * @param {String} keyword - 搜索关键词
   * @param {Number} count - 返回数量
   * @returns {Array} 搜索结果列表
   */
  smartSearch(keyword, count = 10) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }
    
    const lowerKeyword = keyword.toLowerCase();
    
    // 搜索并计算相关度分数
    const searchResults = this.books
      .map(book => {
        let relevanceScore = 0;
        
        // 书名完全匹配
        if (book.name.toLowerCase() === lowerKeyword) {
          relevanceScore += 100;
        }
        // 书名包含关键词
        else if (book.name.toLowerCase().includes(lowerKeyword)) {
          relevanceScore += 60;
        }
        
        // 作者匹配
        if (book.author && book.author.toLowerCase().includes(lowerKeyword)) {
          relevanceScore += 40;
        }
        
        // 出版社匹配
        if (book.publisher && book.publisher.toLowerCase().includes(lowerKeyword)) {
          relevanceScore += 20;
        }
        
        // ISBN匹配
        if (book.isbn && book.isbn.includes(keyword)) {
          relevanceScore += 80;
        }
        
        // 图书简介匹配
        if (book.description && book.description.toLowerCase().includes(lowerKeyword)) {
          relevanceScore += 30;
        }
        
        // 热门程度加成
        const borrowCount = this.borrowRecords.filter(r => r.bookId === book.id).length;
        relevanceScore += Math.min(borrowCount * 2, 20);
        
        return {
          ...book,
          relevanceScore: relevanceScore
        };
      })
      .filter(book => book.relevanceScore > 0) // 只返回相关度大于0的结果
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, count);
    
    return searchResults;
  }
}