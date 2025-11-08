# 图书管理系统维护文档

## 文档说明

本文档旨在为图书管理系统提供全面的维护指南，帮助开发人员和系统管理员理解系统架构、功能模块、数据结构及常见问题的解决方案，确保系统的稳定运行和持续优化。

## 1. 项目概述

### 1.1 系统简介

图书管理系统是一个基于Vue.js开发的单页应用(SPA)，提供了完整的图书管理功能，包括图书信息管理、用户管理、分类管理、借阅记录管理以及智能推荐等功能。系统采用前端MVC架构，使用localStorage实现数据持久化存储。

### 1.2 主要功能

- 用户认证（登录/注册）
- 图书管理（增删改查）
- 用户管理
- 分类管理
- 借阅记录管理
- 智能图书推荐
- 数据统计与可视化

## 2. 技术栈与依赖

### 2.1 核心技术

| 技术/框架 | 版本 | 用途 | 文件位置 |
|----------|------|------|----------|
| Vue.js | 2.6.14 | 前端框架 | <mcfile name="package.json" path="c:\Users\王\Desktop\BMS_最终\BMS\package.json"></mcfile> |
| Vuex | 3.6.2 | 状态管理 | <mcfile name="store/index.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\store\index.js"></mcfile> |
| Vue Router | 3.6.5 | 路由管理 | <mcfile name="router/index.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\router\index.js"></mcfile> |
| Element UI | 2.15.14 | UI组件库 | <mcfile name="main.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\main.js"></mcfile> |

### 2.2 开发工具

- Vue CLI ~5.0.0
- Babel ^7.26.0
- ESLint ^7.32.0

## 3. 项目结构

```
├── public/            # 静态资源
├── src/               # 源代码
│   ├── assets/        # 项目资源
│   ├── components/    # 公共组件
│   ├── data/          # 数据层
│   ├── router/        # 路由配置
│   ├── services/      # 服务层
│   ├── store/         # 状态管理
│   ├── views/         # 页面视图
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── dist/              # 构建输出目录
├── vue.config.js      # Vue CLI配置
├── package.json       # 项目依赖
└── 配置文件            # 其他配置文件
```

### 3.1 目录说明

- **src/assets/**: 存放静态资源如图片、样式文件等
- **src/components/**: 存放可复用的UI组件，如BookList.vue
- **src/data/**: 存放模拟数据和数据相关工具，如database.js
- **src/router/**: 存放路由配置，定义系统页面导航
- **src/services/**: 存放业务逻辑服务，如推荐算法服务
- **src/store/**: 存放Vuex状态管理配置
- **src/views/**: 存放页面级组件，如Books.vue, Users.vue等

## 4. 系统架构

### 4.1 分层架构

系统采用典型的前端分层架构，从下到上依次为：

1. **数据层(Data Layer)**: 处理数据存储和检索
2. **业务层(Business Layer)**: 实现核心业务逻辑
3. **路由层(Routing Layer)**: 管理页面导航和权限控制
4. **视图层(UI Layer)**: 提供用户界面和交互

详细架构说明请参考 <mcfile name="SYSTEM_ARCHITECTURE.md" path="c:\Users\王\Desktop\BMS_最终\BMS\SYSTEM_ARCHITECTURE.md"></mcfile>

### 4.2 数据流

系统采用Vuex进行状态管理，实现单向数据流：

1. 用户在UI层进行操作
2. 触发组件事件，调用Vuex actions/mutations
3. 状态更新，通过getters获取新数据
4. UI自动响应数据变化并更新

## 5. 核心功能模块

### 5.1 图书管理模块

**功能说明**: 实现图书的增删改查操作

**主要文件**: <mcfile name="Books.vue" path="c:\Users\王\Desktop\BMS_最终\BMS\src\views\Books.vue"></mcfile>

**核心功能**:
- 图书列表展示与分页
- 图书搜索功能
- 图书添加、编辑、删除
- 权限控制（仅管理员可操作）

### 5.2 用户管理模块

**功能说明**: 管理系统用户，包括管理员和普通用户

**主要文件**: <mcfile name="Users.vue" path="c:\Users\王\Desktop\BMS_最终\BMS\src\views\Users.vue"></mcfile>

**核心功能**:
- 用户信息管理
- 用户角色分配
- 用户注册与登录认证

### 5.3 借阅管理模块

**功能说明**: 管理图书借阅和归还记录

**主要文件**: <mcfile name="BorrowRecords.vue" path="c:\Users\王\Desktop\BMS_最终\BMS\src\views\BorrowRecords.vue"></mcfile>

**核心功能**:
- 借阅记录查询
- 图书借阅操作
- 图书归还操作
- 借阅状态跟踪

### 5.4 智能推荐模块

**功能说明**: 基于用户借阅历史和图书相似度提供推荐

**主要文件**: <mcfile name="BookRecommendationService.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\services\BookRecommendationService.js"></mcfile>

**核心功能**:
- 热门图书推荐
- 基于用户借阅历史的个性化推荐
- 相似图书推荐
- 基于分类的图书推荐

## 6. 数据模型

### 6.1 用户模型

```javascript
{
  id: Number,        // 用户ID
  username: String,  // 用户名
  password: String,  // 密码
  role: String,      // 角色（admin/user）
  email: String,     // 邮箱
  createTime: String // 创建时间
}
```

### 6.2 图书模型

```javascript
{
  id: Number,        // 图书ID
  name: String,      // 书名
  author: String,    // 作者
  category: String,  // 分类
  description: String, // 描述
  isbn: String,      // ISBN
  price: Number,     // 价格
  stock: Number,     // 库存
  borrowCount: Number, // 借阅次数
  createTime: String // 创建时间
}
```

### 6.3 分类模型

```javascript
{
  id: Number,        // 分类ID
  name: String       // 分类名称
}
```

### 6.4 借阅记录模型

```javascript
{
  id: Number,        // 记录ID
  bookId: Number,    // 图书ID
  userId: Number,    // 用户ID
  borrowDate: String, // 借阅日期
  returnDate: String, // 归还日期
  status: String     // 状态（borrowed/returned）
}
```

## 7. 数据持久化

系统使用localStorage实现数据持久化，存储键名为`bookstore-data`，包含以下数据：

- users: 用户列表
- books: 图书列表
- categories: 分类列表
- borrowRecords: 借阅记录列表

数据持久化逻辑位于 <mcfile name="store/index.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\store\index.js"></mcfile> 中的subscribe方法。

## 8. 权限控制

系统通过路由守卫和组件内权限检查实现权限控制：

1. **路由守卫**: 未登录用户无法访问受保护页面
2. **角色验证**: 管理员和普通用户拥有不同操作权限

权限控制逻辑位于 <mcfile name="router/index.js" path="c:\Users\王\Desktop\BMS_最终\BMS\src\router\index.js"></mcfile> 中的beforeEach方法。

## 9. 开发与部署

### 9.1 开发环境设置

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run serve
```

### 9.2 生产环境部署

1. 构建生产版本
```bash
npm run build
```

2. 部署dist目录下的静态文件到Web服务器

### 9.3 环境配置

- 开发服务器端口: 8080
- 构建输出目录: dist/
- 详细配置请参考 <mcfile name="RUNNING_GUIDE.md" path="c:\Users\王\Desktop\BMS_最终\BMS\RUNNING_GUIDE.md"></mcfile>

## 10. 常见问题与解决方案

### 10.1 依赖安装失败
- 检查网络连接
- 使用npm镜像: `npm config set registry https://registry.npmmirror.com`
- 清理npm缓存: `npm cache clean --force`

### 10.2 端口冲突
- 修改vue.config.js中的端口配置
```javascript
module.exports = {
  devServer: {
    port: 8081,  // 修改为其他端口
    open: true
  }
}
```

### 10.3 数据丢失
- localStorage数据可能因浏览器清理或隐私模式而丢失
- 建议定期备份重要数据

### 10.4 性能优化建议
- 对大量数据列表添加虚拟滚动
- 优化图片资源
- 考虑实现真正的后端API替代localStorage

## 11. 维护注意事项

### 11.1 数据备份

虽然系统使用localStorage存储数据，但仍建议定期备份重要数据。可以通过以下方式：

1. 在浏览器控制台执行：
```javascript
localStorage.getItem('bookstore-data');
```
2. 复制输出的JSON字符串进行保存

### 11.2 版本控制

- 遵循Git工作流
- 新功能开发前创建分支
- 定期合并到主分支

### 11.3 代码规范

- 遵循ESLint规范
- 保持组件命名一致性
- 为复杂逻辑添加注释

### 11.4 扩展建议

1. **后端集成**:
   - 实现RESTful API
   - 使用数据库存储（MySQL/MongoDB）
   - 添加用户认证系统

2. **功能扩展**:
   - 图书借阅期限管理
   - 逾期提醒功能
   - 图书评价与评分
   - 更复杂的推荐算法

3. **性能优化**:
   - 实现服务端渲染
   - 使用Vue 3进行技术升级
   - 添加TypeScript支持

## 12. 联系与支持

对于系统使用中遇到的问题或建议，请联系开发团队。

---

文档创建日期：2024年
维护责任人：系统开发团队