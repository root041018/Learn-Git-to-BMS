# 图书管理系统运行指南

## 环境要求

### 系统要求

- **操作系统**: Windows / macOS / Linux
- **Node.js**: >= 10.0.0 (推荐使用最新LTS版本)
- **npm**: >= 6.0.0 或 yarn >= 1.22.0

### 浏览器兼容性

- Chrome (最新2个版本)
- Firefox (最新2个版本)
- Safari (最新2个版本)
- Edge (最新2个版本)

## 安装步骤

1. **确保Node.js已正确安装**

   ```bash
   node -v
   npm -v
   ```
2. **克隆或下载项目代码**
   将项目代码下载到本地。
3. **进入项目目录**

   ```bash
   cd 项目目录
   ```
4. **安装依赖**

   ```bash
   npm install
   # 或使用yarn
   yarn install
   ```

## 运行项目

### 开发环境

1. **启动开发服务器**

   ```bash
   npm run serve
   # 或使用yarn
   yarn serve
   ```
2. **访问应用**

   - 本地访问: http://localhost:8080/
   - 网络访问: http://[您的IP地址]:8080/
3. **开发特性**

   - 自动打开浏览器
   - 热重载 (文件修改后自动刷新页面)

### 生产环境

1. **构建生产版本**

   ```bash
   npm run build
   # 或使用yarn
   yarn build
   ```
2. **部署构建结果**
   构建完成后，会在 `dist`目录生成可部署的静态文件。您可以将此目录部署到任何支持静态文件的服务器上。

## 配置说明

### 主要配置文件

1. **vue.config.js**

   - 开发服务器端口: 8080
   - 自动打开浏览器: 启用
   - ESLint检查: 禁用
2. **babel.config.js**

   - 使用Vue CLI默认的Babel配置
3. **jsconfig.json**

   - 配置路径别名: `@` 指向 `src` 目录
   - 支持ESNext特性

### 环境变量

项目支持创建 `.env`系列文件来配置环境变量，但请注意：

- `.env.local` 和 `.env.*.local` 文件会被Git忽略，适合存放本地开发配置
- 生产环境变量可以通过部署服务器配置

## 常见问题解决

### 依赖安装失败

- 检查网络连接
- 尝试使用npm镜像: `npm config set registry https://registry.npmmirror.com`
- 清理npm缓存: `npm cache clean --force`

### 端口冲突

如果8080端口被占用，可以修改 `vue.config.js`中的端口配置：

```javascript
module.exports = {
  devServer: {
    port: 8081,  // 修改为其他端口
    open: true
  }
}
```

### 构建失败

- 检查代码是否存在语法错误
- 确保所有依赖都已正确安装
- 查看终端输出的详细错误信息进行排查

## 开发工具推荐

- **编辑器**: VS Code + Vetur/Volar插件
- **浏览器调试**: Chrome DevTools
- **格式化工具**: Prettier
