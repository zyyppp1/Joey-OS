# 🖥️ Joey OS: A Serverless Web Desktop & Interactive Portfolio

> **Transforming a static resume into a fully interactive, event-driven Web Operating System.**

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![AWS Serverless](https://img.shields.io/badge/AWS-Lambda%20%7C%20API%20Gateway%20%7C%20DynamoDB-orange?logo=amazon-aws)
![Redis](https://img.shields.io/badge/Redis-Upstash%20Serverless-red?logo=redis)
![WebSockets](https://img.shields.io/badge/RealTime-Pusher%20WebSockets-purple?logo=pusher)

## 📖 Overview

Traditional static portfolios often fail to demonstrate a backend developer's architectural and system design capabilities. **Joey OS** was built to solve this. It is a highly interactive Web OS that serves as my resume, technical blog, and a playground for demonstrating cloud-native engineering.

**Read the full Architectural Review in the built-in `Blogs.exe` app or view it [here](#).**

## 🏗️ Architecture & Tech Stack

This project adopts a **Serverless & Event-Driven Architecture** to ensure high availability, zero maintenance, and strict cost control.

### 1. Frontend: The "Virtual Canvas" Desktop
- **Core:** Next.js (App Router), React 19, Tailwind CSS, TypeScript.
- **Window Management:** Utilizes `react-rnd` combined with a custom **Virtual Canvas Scaling Algorithm**. Instead of relying on CSS media queries that break aspect ratios, the entire desktop scales proportionally based on a 1800x920 base resolution (`transform: scale()`), ensuring zero window overlap on 13" laptops while optically centering on 4K monitors.
- **Touch Event Optimization:** Bypassed the native 300ms mobile click delay by implementing explicit event exemption zones (`cancel-drag`) and `onTouchEnd` bindings, achieving native-app-like responsiveness.

### 2. Backend: Event-Driven Serverless APIs
- **Monolithic Lambda Router:** Instead of managing multiple micro-Lambdas, a single Python Lambda function sits behind an AWS API Gateway, routing incoming actions (e.g., `get_metrics`, `send_telegram`, `ask_ai`).
- **Telemetry & Storage:** AWS DynamoDB is used for persistent storage, while **Upstash Serverless Redis** handles transient data and high-speed atomic operations.

### 3. External Integrations & Real-Time Comm
- **Bidirectional Live Chat:** Bypassed inefficient HTTP polling. Web frontend talks to the Telegram Bot API via AWS Lambda. When the admin replies via Telegram, a Webhook triggers the AWS backend, which uses **Pusher WebSockets** to deliver the message to the visitor's browser in sub-seconds.
- **AI Agent (DeepSeek LLM):** Context-aware AI assistant.
- **Dynamic Portfolios:** Uses GitHub REST APIs to fetch real-time repository data, bypassing iframe `X-Frame-Options: DENY` restrictions.

## 🔒 Security & Rate Limiting

Exposing an LLM API and a direct-to-mobile Telegram notification route on the public internet poses significant abuse risks (e.g., DDOS, token exhaustion). 
- **IP-Based Rate Limiting:** Implemented a sliding window rate-limiting mechanism using **Upstash Redis**. If a user exceeds the threshold (e.g., >15 requests/hour), the API Gateway immediately returns a `429 Too Many Requests` status, protecting backend resources.
- **Environment Isolation:** Zero hardcoded secrets. All API keys and endpoints are strictly managed via environment variables.

---

## 🚀 How to Fork & Run Locally

I built Joey OS with open-source adaptability in mind. You can easily fork this repository and configure it with your own AWS backend and API keys.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/joey-os.git
cd joey-os
npm install
\`\`\`

### 2. Environment Variables Setup
To ensure strict privacy and security, **never commit your secrets**. Create a `.env.local` file in the root directory (this file is ignored by Git):

\`\`\`env
# .env.local

# [REQUIRED] Your AWS API Gateway Endpoint
NEXT_PUBLIC_AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/webhook

# [REQUIRED] Pusher WebSockets Credentials (for Live Chat)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# [OPTIONAL] Environment Isolation (local | stage | production)
# Changes the desktop background color dynamically to prevent staging confusion.
NEXT_PUBLIC_APP_ENV=local 
\`\`\`

### 3. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) to view your OS.

## ☁️ Deployment (AWS Amplify)

When deploying to platforms like AWS Amplify or Vercel, ensure you inject the environment variables via their respective CI/CD dashboards:
1. Navigate to **Environment variables** in your hosting console.
2. Add `NEXT_PUBLIC_AWS_API_URL`, `NEXT_PUBLIC_PUSHER_KEY`, and `NEXT_PUBLIC_PUSHER_CLUSTER`.
3. Use the **Branch Overrides** feature to set `NEXT_PUBLIC_APP_ENV=stage` for your testing branch, which will dynamically render the desktop in a different color to distinguish it from production.

---
*Designed & Engineered by [Joey (Yepeng) Zhu](https://yepengzhu.com)*