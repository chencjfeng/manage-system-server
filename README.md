# manage-system-server
`manage-system-server` 是一个基于 Node.js、Koa、TypeORM、routing-controllers、MySQL 和 Redis 的纯 TypeScript 管理系统后端 RESTful 接口工程。该项目旨在为管理系统提供高效、灵活和可扩展的后端服务。

## 特性

- **纯 TypeScript 工程**: 整个项目使用 TypeScript 开发，充分利用其类型系统和现代 JavaScript 特性，提升代码的可维护性和可读性。
- **纯 Node.js 开发**: 完全基于 Node.js 构建，充分发挥其非阻塞 I/O 的优势，提供高性能的后端服务。
- **结构化工程**: 采用模块化和面向对象的设计理念，前端开发者也能轻松构建出与 Java 相似的结构化工程，降低学习成本，提升开发效率。
- **RESTful API**: 提供标准的 RESTful 接口，支持 CRUD 操作，方便前端与后端的交互。
- **用户管理**: 实现用户的注册、登录、权限管理等功能，确保系统的安全性和可控性。
- **数据持久化**: 使用 TypeORM 进行数据建模和操作，支持 MySQL 数据库，确保数据的可靠存储。
- **缓存机制**: 集成 Redis 作为缓存层，提高系统的响应速度和性能，减轻数据库负担。
- **中间件支持**: 利用 Koa 的中间件机制，灵活处理请求和响应，支持日志记录、错误处理等功能。

## 安装使用

确保您已经安装了 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)。（建议使用版本：v16.20.0）

```bash
# 克隆项目
git clone https://github.com/chencjfeng/manage-system-server.git

# 进入项目目录
cd manage-system-server

# 安装依赖
npm install

# 数据库表初始化
npm run typeorm:run

# 本地运行
npm run dev

# 部署运行
npm run start

```

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/YourFeature`)
3. 提交您的更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/YourFeature`)
5. 创建一个新的 Pull Request

## 许可证

该项目使用 MIT 许可证进行许可。有关详细信息，请参阅 [LICENSE](https://github.com/chencjfeng/manage-system-server/blob/main/LICENSE) 文件。

Copyright (c) 2024-present, ChenJF
