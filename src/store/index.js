/**
 * Vuex状态管理配置文件
 * 管理用户、图书、分类等数据的状态
 */

// 导入Vue和Vuex
import Vue from 'vue';
import Vuex from 'vuex';
// 导入数据和ID生成工具
import { database, generateId } from '../data/database';

// 安装Vuex插件
Vue.use(Vuex);

// 创建Vuex实例
const store = new Vuex.Store({
  // 定义状态
  state: {
    users: database.users,         // 用户列表
    books: database.books,         // 图书列表
    categories: database.categories, // 分类列表
    currentUser: null,             // 当前登录用户
    borrowRecords: []              // 借阅记录列表
  },

  // 定义修改状态的方法
  mutations: {
    // 设置当前登录用户
    setCurrentUser(state, user) {
      state.currentUser = user;
    },

    // 用户相关的mutations
    addUser(state, user) {
      user.id = generateId(state.users);  // 生成新用户ID
      state.users.push(user);
    },
    updateUser(state, user) {
      const index = state.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        state.users[index] = user;
      }
    },
    deleteUser(state, userId) {
      state.users = state.users.filter(u => u.id !== userId);
    },

    // 图书相关的mutations
    addBook(state, book) {
      book.id = generateId(state.books);  // 生成新图书ID
      state.books.push(book);
    },
    updateBook(state, book) {
      const index = state.books.findIndex(b => b.id === book.id);
      if (index !== -1) {
        state.books[index] = book;
      }
    },
    deleteBook(state, bookId) {
      state.books = state.books.filter(b => b.id !== bookId);
    },

    // 分类相关的mutations
    addCategory(state, category) {
      category.id = generateId(state.categories);  // 生成新分类ID
      state.categories.push(category);
    },
    updateCategory(state, category) {
      const index = state.categories.findIndex(c => c.id === category.id);
      if (index !== -1) {
        state.categories[index] = category;
      }
    },
    deleteCategory(state, categoryId) {
      state.categories = state.categories.filter(c => c.id !== categoryId);
    },

    // 借阅记录相关的mutations
    addBorrowRecord(state, record) {
      record.id = generateId(state.borrowRecords);  // 生成新记录ID
      record.borrowDate = new Date().toISOString(); // 设置借阅日期
      record.returnDate = null;                     // 初始还书日期为空
      record.status = 'borrowed';                   // 状态为借阅中
      state.borrowRecords.push(record);
    },
    returnBook(state, recordId) {
      const record = state.borrowRecords.find(r => r.id === recordId);
      if (record) {
        record.returnDate = new Date().toISOString(); // 设置还书日期
        record.status = 'returned';                   // 更新状态为已归还
      }
    },
    deleteBorrowRecord(state, recordId) {
      state.borrowRecords = state.borrowRecords.filter(r => r.id !== recordId);
    }
  }
});

// 添加数据持久化插件
// 在状态变更时将数据保存到localStorage
store.subscribe((mutation, state) => {
  localStorage.setItem('bookstore-data', JSON.stringify({
    users: state.users,
    books: state.books,
    categories: state.categories,
    borrowRecords: state.borrowRecords
  }));
});

// 初始化时从localStorage加载数据
// 如果有保存的数据则恢复到状态中
const savedData = localStorage.getItem('bookstore-data');
if (savedData) {
  const data = JSON.parse(savedData);
  store.state.users = data.users || database.users;
  store.state.books = data.books || database.books;
  store.state.categories = data.categories || database.categories;
  store.state.borrowRecords = data.borrowRecords || [];
}

// 导出store实例
export default store;
