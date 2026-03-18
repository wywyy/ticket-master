# Ticket Master - 演出门票应用

一款使用 UniApp、Vue 3 和 TypeScript 构建的综合性演出门票应用程序。该应用程序允许用户发现活动，浏览门票信息。

## 🚀 功能特点

- **活动发现**: 浏览各种活动并提供详细信息
- **搜索功能**: 通过关键词或类别查找活动
- **响应式界面**: 瀑布流布局，优化观看体验
- **下拉刷新**: 直观的刷新机制，获取最新内容
- **无限滚动**: 向下滚动时加载更多活动
- **跨平台**: 支持多个平台（iOS、Android、H5、小程序）

## ✨ 核心交互特色：卡片展开效果

本应用实现了类似 App Store 的流畅交互体验。当用户点击活动卡片时：

1. **原位展开**：卡片会在其原始位置平滑放大，保持上下文感知，给用户连贯的视觉体验
2. **沉浸式详情**：展开后的详情页提供完整的活动信息，增强用户体验
3. **返回交互**：支持反向动画返回，确保交互的完整性


## 🛠️ 技术栈

- **框架**: [UniApp](https://en.uniapp.dcloud.io/) - 使用 Vue.js 的跨平台框架
- **前端**: Vue 3 配合组合式 API
- **语言**: TypeScript 保证类型安全
- **UI 组件**: UV UI 库
- **API 集成**: 使用自定义 HTTP 客户端的 RESTful API 调用

## 🏗️ 项目结构

```
ticket-master/
├── api/                    # API 模块和服务
│   ├── index.ts            # 导出 API 模块
│   └── modules/
│       └── ticket.ts       # 门票/活动相关的 API 调用
├── components/             # 可复用的 UI 组件
│   └── eventComponents/
│       ├── EventDetails.vue # 活动详情视图
│       └── EventItem.vue    # 单个活动项目
├── config/                 # 配置文件
├── const/                  # 常量
├── pages/                  # 页面组件
│   └── index/              # 主页
│       └── index.vue
├── types/                  # TypeScript 类型定义
├── uni_modules/            # UniApp 第三方模块
├── utils/                  # 工具函数
│   └── http.ts             # HTTP 客户端包装器
├── App.vue                 # 主应用程序组件
├── main.js                 # 入口点
├── manifest.json           # 应用配置
└── pages.json              # 页面路由配置
```

## 🔧 运行方式

1. 克隆仓库：
   ```bash
   git clone https://github.com/wywyy/ticket-master.git
   cd ticket-master
   ```

2. 使用 HBuilder X 打开项目

3. 在 `config/index.ts` 文件中配置 TicketMaster API 密钥：
   ```typescript
   export default {
     baseURL: 'YOUR_API_BASE_URL',
     timeout: 10000,
     apikey: 'YOUR_API_KEY'
   }
   ```
