[English](README.md) | [简体中文](README_zh.md)

# 🖥️ Joey OS: 基于 Serverless 的 Web 桌面级个人主页

> **将传统的静态简历转化为高交互、事件驱动的 Web 操作系统。**

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![AWS Serverless](https://img.shields.io/badge/AWS-Lambda%20%7C%20API%20Gateway%20%7C%20DynamoDB-orange?logo=amazon-aws)
![Redis](https://img.shields.io/badge/Redis-Upstash%20Serverless-red?logo=redis)
![WebSockets](https://img.shields.io/badge/RealTime-Pusher%20WebSockets-purple?logo=pusher)

## 📖 项目简介

传统的瀑布流静态主页往往难以直观展现后端开发者的架构思维与系统设计能力。**Joey OS** 正是为此而生。它不仅是一个高度交互的 Web 操作系统，更是我的个人简历、技术博客以及展示云原生工程能力的“试验田”。

## 🏗️ 架构与技术栈

本项目采用了**无服务器（Serverless）与事件驱动（Event-Driven）架构**，以确保系统的高可用性、零运维成本以及严格的成本控制。

- **前端核心:** Next.js (App Router), React 19, Tailwind CSS, TypeScript.
- **视窗引擎:** `react-rnd` (负责窗口拖拽与尺寸管理).
- **后端 (Serverless):** AWS API Gateway, AWS Lambda (Python), AWS DynamoDB.
- **实时通讯:** Pusher (WebSockets), Telegram Bot API.
- **AI 与安全:** DeepSeek LLM API, Upstash Serverless Redis.
- **DevOps:** AWS Amplify.

---

## 🔥 核心工程亮点

- **“零依赖”极简部署 (Zero-Dependency Deployment):** Serverless 开发常见的痛点是部署包体积过大。Joey OS 的后端是一个单体 Python Lambda，严格只使用原生的 `urllib.request` 模块。通过摒弃第三方依赖（如 `requests` 或官方 SDK），彻底免去了繁琐的 `.zip` 打包或 Lambda Layers 配置。任何人都可以 Fork 本仓库，并将后端代码直接复制粘贴到 AWS Lambda 的内联编辑器中运行。
- **手写 WebSocket HMAC 签名 (Hand-Rolled HMAC Signatures):** 没有使用臃肿的 Pusher 官方 SDK，而是从零开始构建了 WebSocket 的鉴权与广播逻辑。通过手动拼装 HTTP 请求，并使用 Python 原生的 `hashlib` 和 `hmac` 生成 SHA256 签名，系统在保持极小运行时体积的同时，证明了对底层密码学鉴权协议和 RESTful 标准的深刻理解。
- **无 VPC 的 Serverless 架构 (VPC-Less Serverless):** 实现 API 限流通常需要 Redis。然而，在 AWS 部署 ElastiCache 需要配置复杂的 VPC 网络，这会不可避免地导致 Lambda 产生“冷启动（Cold-start）”延迟并产生持续费用。Joey OS 巧妙地采用了 **Upstash Serverless Redis**，完全通过公网 REST API 进行通信。这既获得了 Redis 的高并发优势，又规避了 VPC 的沉重开销。

---

## 🧠 技术挑战与解决方案

### 1. 响应式 UI：虚拟画布缩放算法
- **挑战:** 基于绝对像素坐标定位的窗口，在较小的屏幕（13吋）上会严重重叠，而在大显示器（如 Mac Pro）上则会留下大量空白。如果使用标准的 CSS 媒体查询强行压缩窗口，会破坏原有的长宽比和内部排版。
- **解决方案:** 我将整个桌面视为一块“虚拟画布 (Virtual Canvas)”，设定理想的基准分辨率（1800x920）。系统监听 `resize` 事件，动态计算缩放比例（`Math.min(scaleX, scaleY, 1)`），并对父容器应用 `transform: scale()`。至关重要的是，该计算出的缩放值会被向下传递给 `react-rnd` 拖拽引擎，以进行底层的坐标补偿，确保在任何分辨率下鼠标轨迹的绝对精准。

### 2. 移动端触控事件冲突
- **挑战:** 在移动端测试时，窗口的最小化/关闭按钮偶尔失效。按钮的视觉点击效果已触发，但业务逻辑未执行。
- **解决方案:** 经分析，移动端浏览器的 300ms 点击延迟，结合底层拖拽库拦截了 `touchstart` 事件（`preventDefault`），导致点击事件被意外吞噬。我通过为交互按钮添加 `cancel-drag` 类名，引入了“事件豁免区”。同时，将传统的 `onClick` 替换为移动端专属的 `onTouchEnd` 绑定，实现了零延迟、精确的触控响应。

### 3. Live Chat — 移动端 WebSocket 断连与消息丢失

- **挑战:** 在跨设备测试中发现了一个隐蔽但关键的 Bug。当访客用**手机 Chrome** 打开网站后，切换到 Telegram 查看消息，Joey 回复后再切回 Chrome——回复始终不显示。而完全相同的操作在桌面端（Mac Chrome）则完全正常。

  | 测试场景 | 结果 | 原因 |
  |---|---|---|
  | Mac Chrome 开网页 → 手机 Telegram 回复 | ✅ 正常 | 桌面浏览器一直保持活跃 |
  | Mac Chrome 开网页 → Mac Telegram 回复 | ✅ 正常 | 桌面浏览器一直保持活跃 |
  | 手机 Chrome 开网页 → Mac Telegram 回复（无切换 App） | ✅ 正常 | 浏览器始终在前台 |
  | **手机 Chrome 开网页 → 切换至 Telegram → 回复** | ❌ 失败 | **OS 将后台标签页挂起** |

- **根本原因:** iOS 和 Android 在用户切换 App 的瞬间，就会激进地挂起后台浏览器标签页。这会触发 Page Visibility API（`visibilityState → 'hidden'`），OS 在数秒内切断后台网络活动——这远早于 Pusher 的心跳超时检测。当 Joey 的回复通过 Pusher 推送时，WebSocket 频道已无活跃订阅者。由于 **Pusher 不缓存未送达的事件**，消息永久丢失。React 组件的 state 依然完整，但 WebSocket 连接已静默死亡。

- **解决方案:** 实现了双层恢复机制：
  1. **重连层：** 添加 `visibilitychange` 事件监听。当页面回到前台（`'visible'`）时，立即断开已死的旧 Pusher 实例，重新建立 WebSocket 连接并重新订阅 session 频道。
  2. **消息补全层：** 同时调用新增的 `get_live_messages` Lambda 接口，按 `session_id` 查询 DynamoDB 中所有存档消息。由于每条消息（访客消息和 Joey 的回复）在发送时都会实时写入 DynamoDB，这使其成为可靠的离线缓冲区。前端将返回的消息与本地 state 进行合并（按消息文本去重），确保无论后台停留多久，消息都不会丢失。

### 4. 突破跨域 iframe 嵌套限制
- **挑战:** 尝试通过 `iframe` 直接内嵌真实的 GitHub 和 LinkedIn 个人主页时，被顶级站点的防点击劫持安全策略（`X-Frame-Options: DENY`）拦截。
- **解决方案:** 采用了“API 提取 + 前端重绘”的策略。
  - **GitHub:** 轮询公开的 GitHub REST API 动态拉取仓库数据，并集成 `github-readme-stats` 的 SVG 可视化图像，重构了一个功能完整的极客风终端 UI。
  - **LinkedIn:** 利用 CSS 动画（激光扫描线）和 React 渲染了一张高仿真的数字名片，提供安全外链的同时，保持了桌面系统的沉浸式体验。

---

## 💬 Live Chat — 完整工作流程

Live Chat 功能通过无服务器事件驱动管道，实现了网站访客与 Joey（通过 Telegram）之间的实时双向通讯。

```
访客（浏览器）                         AWS 后端                      Joey（Telegram）
      |                                   |                              |
      |  1. 输入并发送消息                |                              |
      |  POST { action: send_telegram,    |                              |
      |         session_id, message }     |                              |
      | --------------------------------> |                              |
      |                                   |  2. save_live_message()      |
      |                                   |     → DynamoDB（访客消息）   |
      |                                   |                              |
      |                                   |  3. send_to_telegram()       |
      |                                   |     "📩 新网页消息!          |
      |                                   |      Session: ABC123XY       |
      |                                   |      Visitor: 你好!"         |
      |                                   | ---------------------------> |
      |                                   |                              |  4. Joey 查看
      |                                   |                              |     并回复
      |                                   |  5. Telegram Webhook 回调    |
      |                                   | <--------------------------- |
      |                                   |                              |
      |                                   |  6. handle_telegram_webhook()|
      |                                   |     从原始消息中解析         |
      |                                   |     session_id               |
      |                                   |     save_live_message()      |
      |                                   |     → DynamoDB（Joey 回复）  |
      |                                   |                              |
      |                                   |  7. trigger_pusher()         |
      |                                   |     channel: session-ABC123XY|
      |                                   |     event: new_message       |
      |  8. Pusher WebSocket 推送         |                              |
      | <-------------------------------- |                              |
      |                                   |                              |
      |  9. channel.bind('new_message')   |                              |
      |     setMessages() → UI 更新       |                              |
```

**关键设计决策：**

- **Session ID 作为路由键：** 每个访客 session 生成一个唯一 ID（首次加载时生成，以模块级变量存储，关闭窗口不重置，仅页面刷新才重置）。该 ID 被嵌入 Telegram 消息文本中，Joey 回复时 Lambda 即可解析并将 Pusher 推送路由到对应的浏览器标签页。
- **DynamoDB 作为持久化缓冲区：** 每条消息——访客消息和 Joey 回复——均在发送瞬间写入 DynamoDB。这将消息投递与持久化解耦，也使上述移动端断线恢复成为可能。
- **聊天记录跨窗口保持：** 消息数组存储在模块级 JavaScript 变量中（位于 React 组件 state 之外）。关闭并重新打开 Live Chat 窗口，完整对话记录得以恢复；只有整页刷新才会重置。

## 🔒 安全、隐私与开源适配

将直连手机的 WebSockets 和 LLM API 暴露在公网上，会带来严重的 DDOS 攻击和 Token 耗尽风险。

- **基于 Redis 的 IP 限流:** 为了防止恶意滥用，我在 API Gateway 层面利用 Upstash Serverless Redis 实现了滑动窗口限流器。系统提取客户端 IP，一旦请求超过阈值（如 >15次/小时），立即返回 `429 Too Many Requests`，有效保护了后端架构。
- **密钥管理与开源适配:** Joey OS 被设计为极易 Fork 的开源项目。为了严格保护隐私，代码库中**绝对不存在硬编码的密钥 (Zero Hardcoded Secrets)**。所有的敏感端点和密钥均在运行时注入：本地开发依赖 `.env.local` 文件，生产环境则依赖 AWS Amplify 的环境变量面板。

---

## 🚀 如何本地运行与部署

Joey OS 在设计之初就考虑了开源适配性。你可以轻松 Fork 此仓库，并配置属于你自己的 AWS 后端和 API 密钥。

### 1. 克隆代码仓库

```bash
git clone [https://github.com/YOUR_USERNAME/joey-os.git](https://github.com/YOUR_USERNAME/joey-os.git)
cd joey-os
npm install
```

### 2. 环境变量配置

为确保隐私和安全，**切勿提交你的密钥**。在项目根目录创建一个 `.env.local` 文件：

```
# .env.local

# [必填] 你的 AWS API Gateway 端点
NEXT_PUBLIC_AWS_API_URL=[https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/webhook](https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/webhook)

# [必填] Pusher WebSockets 密钥 (用于 Live Chat)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# [选填] 环境隔离 (local | stage | production)
# 将动态改变桌面背景色，防止测试环境与生产环境混淆。
NEXT_PUBLIC_APP_ENV=local 
```
### 3. 部署后端 (AWS Lambda)

1. 进入仓库的 `aws-backend/` 目录，复制 `lambda_function.py`的内容。
2. 登录 AWS 控制台，新建一个 Lambda 函数 (Python 3.12+)，将代码直接粘贴到内联编辑器中。无需上传 `.zip` 包!
3. 通过 **AWS API Gateway** 暴露该 Lambda (确保已开启 CORS)。
4. 在 AWS Lambda 配置以下： **Environment Variables** ：
* `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`
* `LLM_API_KEY`
* `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
* `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`


5. 设置一个 **Telegram Webhook** 指向你的 API Gateway URL。

### 4. 启动本地开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) 即可预览你的专属 OS。

---

*Architected & Engineered by [Joey (Yepeng) Zhu*](https://yepengzhu.com)

