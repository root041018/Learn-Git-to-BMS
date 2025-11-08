/**
 * 应用根组件
 * 提供全局布局和样式定义
 */

<template>
  <!-- 应用根容器 -->
  <div id="app">
    <!-- 路由视图出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 文本选择高亮样式 */
::selection {
  background-color: #409eff;
  color: white;
}

::-moz-selection {
  background-color: #409eff;
  color: white;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s, color 0.3s;
}

#app {
  height: 100%;
}

/* 内容区域 */
.main-content {
  padding: 20px;
  min-height: calc(100vh - 60px);
  transition: all 0.3s;
}

/* Element UI 组件样式优化基础样式 */
.el-card {
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.el-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.el-table {
  background-color: transparent;
  border-radius: 6px;
  overflow: hidden;
}

.el-table th {
  font-weight: 600;
  transition: all 0.3s;
}

.el-table td {
  transition: background-color 0.2s;
}

.el-pagination {
  padding: 20px 0;
  text-align: center;
}

/* 按钮样式优化 */
.el-button {
  border-radius: 4px;
  transition: all 0.2s;
}

.el-button:active {
  transform: translateY(1px);
}

/* 表单样式 */
.el-form-item {
  margin-bottom: 20px;
}

/* 输入框样式 */
.el-input__inner {
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s;
}

/* 对话框样式 */
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.el-dialog {
  border-radius: 8px;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  transition: all 0.3s;
}

/* 标签页样式 */
.el-tabs__header {
  margin-bottom: 20px;
}

/* 加载动画样式 */
.el-loading-mask {
  backdrop-filter: blur(2px);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  transition: background 0.3s;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式优化 */
@media screen and (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
  
  .el-dialog {
    width: 95% !important;
    margin: 0 !important;
  }
}

/* ========================== 主题样式 ========================== */

/* 默认主题 */
body.theme-default {
  color: #333;
  background-color: #f6f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body.theme-default .main-content {
  background-color: #f6f8fa;
}

body.theme-default .el-card {
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

body.theme-default .el-table th {
  background-color: #f8fafd;
  color: #2c3e50;
}

body.theme-default .el-input__inner {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #303133;
}

body.theme-default .el-input__inner:focus {
  border-color: #409eff;
}

body.theme-default .el-dialog {
  background-color: #ffffff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

body.theme-default ::-webkit-scrollbar-thumb {
  background: #c0c4cc;
}

body.theme-default ::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* ========================== 日落橙主题 ========================== */
body.theme-dark {
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #4a2c2a 0%, #602e25 100%);
  color: #fff9ed;
}

body.theme-dark .main-content {
  background-color: rgba(86, 55, 52, 0.8);
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 40%);
}

body.theme-dark .el-card {
  background: rgba(86, 55, 52, 0.9);
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 4px 20px rgba(40, 20, 10, 0.2);
  color: #fff9ed;
  transition: all 0.3s ease;
}

body.theme-dark .el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}

body.theme-dark .el-table {
  background: rgba(86, 55, 52, 0.9);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fff9ed;
}

body.theme-dark .el-table th {
  background: rgba(92, 60, 57, 0.9);
  color: #fff9ed;
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

body.theme-dark .el-table td {
  color: #ffd9b3;
  border-bottom: 1px solid rgba(245, 158, 11, 0.1);
}

body.theme-dark .el-table tr:hover > td {
  background-color: rgba(245, 158, 11, 0.1);
}

body.theme-dark .el-input__inner {
  background: rgba(92, 60, 57, 0.7);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fff9ed;
  transition: all 0.3s;
}

body.theme-dark .el-input__inner:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
  background: rgba(92, 60, 57, 0.9);
}

body.theme-dark .el-dialog {
  background: rgba(86, 55, 52, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 10px 40px rgba(40, 20, 10, 0.4);
  color: #fff9ed;
}

body.theme-dark .el-dialog__title {
  color: #fff9ed;
  font-weight: 600;
}

body.theme-dark .el-button {
  border-radius: 6px;
  transition: all 0.3s;
  background-color: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
  color: #fff9ed;
}

body.theme-dark .el-button:hover {
  background-color: rgba(245, 158, 11, 0.3);
  border-color: #f59e0b;
}

body.theme-dark .el-button--primary {
  background: linear-gradient(45deg, #d97706, #f59e0b);
  border: none;
  box-shadow: 0 2px 12px rgba(245, 158, 11, 0.3);
  color: #4a2c2a;
  font-weight: 600;
}

body.theme-dark .el-button--primary:hover {
  background: linear-gradient(45deg, #92400e, #d97706);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
}

body.theme-dark ::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.4);
}

body.theme-dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.6);
}

body.theme-default .el-dialog__header {
  background-color: #ffffff;
}

body.theme-default .el-loading-spinner .path {
  stroke: #409eff;
}

body.theme-default ::-webkit-scrollbar-thumb {
  background: #c0c4cc;
}

body.theme-default ::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 添加日落橙主题的额外样式 */
body.theme-dark .el-loading-spinner .path {
  stroke: #f59e0b;
}

body.theme-dark .el-loading-text {
  color: #fff9ed;
}

body.theme-dark .el-checkbox__label {
  color: #f59e0b;
  font-weight: bold;
}

body.theme-dark .el-radio__label {
  color: #f59e0b;
  font-weight: bold;
}

body.theme-dark .el-form-item__label {
  color: #f59e0b;
  font-weight: bold;
}

body.theme-dark .el-select-dropdown {
  background-color: rgba(86, 55, 52, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

body.theme-dark .el-option {
  color: #fff9ed;
}

body.theme-dark .el-option:hover {
  background-color: rgba(245, 158, 11, 0.1);
}

body.theme-dark .el-option-selected {
  background-color: rgba(245, 158, 11, 0.2);
}

body.theme-dark .el-pagination.is-background .el-pager li {
  background: rgba(92, 60, 57, 0.5);
  color: #fff9ed;
}

body.theme-dark .el-pagination.is-background .el-pager li:hover {
  background: rgba(245, 158, 11, 0.2);
}

body.theme-dark .el-pagination.is-background .el-pager li.active {
  background: linear-gradient(45deg, #d97706, #f59e0b);
  color: #4a2c2a;
}

body.theme-dark .el-tag--success {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}



/* ========================== 玻璃拟态主题 ========================== */
body.theme-glass {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf5 100%);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
    radial-gradient(circle at 75% 75%, rgba(220, 230, 250, 0.5) 0%, transparent 40%);
  color: #334155;
  min-height: 100vh;
}

body.theme-glass .main-content {
  background: transparent;
  backdrop-filter: blur(8px);
}

body.theme-glass .el-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 4px 20px rgba(166, 180, 200, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  color: #334155;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

body.theme-glass .el-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 
    0 8px 32px rgba(166, 180, 200, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  border-color: rgba(255, 255, 255, 0.7);
}

body.theme-glass .el-table {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #334155;
  border-radius: 10px;
  overflow: hidden;
}

body.theme-glass .el-table th {
  background: rgba(248, 250, 252, 0.8);
  color: #334155;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  font-weight: 700;
}

body.theme-glass .el-table td {
  color: #475569;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  font-weight: 500;
}

body.theme-glass .el-table tr:hover > td {
  background-color: rgba(248, 250, 252, 0.8);
}

body.theme-glass .el-input__inner {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  color: #334155;
  transition: all 0.3s;
  font-weight: 500;
  border-radius: 8px;
}

body.theme-glass .el-input__inner:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  background: rgba(255, 255, 255, 0.8);
}

body.theme-glass .el-dialog {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 
    0 20px 60px rgba(166, 180, 200, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
  color: #334155;
  border-radius: 16px;
}

body.theme-glass .el-dialog__title {
  color: #334155;
  font-weight: 700;
}

body.theme-glass .el-button {
  border-radius: 8px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  color: #334155;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(166, 180, 200, 0.1);
}

body.theme-glass .el-button:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #60a5fa;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.15);
}

body.theme-glass .el-button--primary {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border: none;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);
  color: #ffffff;
  font-weight: 700;
}

body.theme-glass .el-button--primary:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

body.theme-glass ::-webkit-scrollbar-thumb {
  background: rgba(166, 180, 200, 0.6);
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

body.theme-glass ::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.8);
}

body.theme-glass .el-loading-spinner .path {
  stroke: #60a5fa;
}

body.theme-glass .el-loading-text {
  color: #60a5fa;
  font-weight: 600;
}

body.theme-glass .el-checkbox__label {
  color: #334155;
  font-weight: 500;
}

body.theme-glass .el-radio__label {
  color: #334155;
  font-weight: 500;
}

body.theme-glass .el-form-item__label {
  color: #334155;
  font-weight: 600;
}

body.theme-glass .el-select-dropdown {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 8px 32px rgba(166, 180, 200, 0.15);
  border-radius: 10px;
  overflow: hidden;
}

body.theme-glass .el-option {
  color: #334155;
  font-weight: 500;
}

body.theme-glass .el-option:hover {
  background-color: rgba(248, 250, 252, 0.8);
}

body.theme-glass .el-option-selected {
  background-color: rgba(96, 165, 250, 0.1);
  color: #3b82f6;
}

body.theme-glass .el-pagination.is-background .el-pager li {
  background: rgba(255, 255, 255, 0.7);
  color: #334155;
  font-weight: 600;
  border-radius: 6px;
  margin: 0 3px;
}

body.theme-glass .el-pagination.is-background .el-pager li:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #3b82f6;
}

body.theme-glass .el-pagination.is-background .el-pager li.active {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(96, 165, 250, 0.3);
}

body.theme-glass .el-tag--success {
  background-color: rgba(96, 165, 250, 0.1);
  color: #3b82f6;
  border-color: rgba(96, 165, 250, 0.3);
  font-weight: 600;
  border-radius: 6px;
}
</style>