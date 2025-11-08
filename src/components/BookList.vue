<template>
    <div>
      <!-- 使用 Element UI 的表格组件展示图书信息 -->
      <!-- :data 绑定图书数据源 -->
      <el-table :data="bookInfo">
        <!-- 定义表格列,每列对应图书信息的不同属性 -->
        <!-- prop 指定数据属性名, label 指定列标题 -->
        <el-table-column prop="name" label="书名"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="publish" label="出版社"></el-table-column>
        <el-table-column prop="ISBN" label="ISBN"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="number" label="剩余数量"></el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  /**
   * 图书列表组件
   * 用于展示图书馆藏书的基本信息
   */
  
  // 从 library.js 导入图书数据集合
  import { list } from '@/assets/library.js';
  
  export default {
    name: 'BookList', // 组件名称
    
    /**
     * 组件数据
     * @returns {Object} 包含组件所需的数据
     */
    data() {
      return {
        // bookInfo: 图书信息列表
        // 包含书名、作者、出版社、ISBN、价格和库存数量等信息
        bookInfo: list.bookInfo  // 使用导入的 list 对象访问 bookInfo
      };
    }
  };
  </script>

  <style scoped>
 
  </style>