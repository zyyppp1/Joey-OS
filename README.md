

# 🖥️ Joey OS: A Serverless Web Desktop & Interactive Portfolio

> **Transforming a static resume into a fully interactive, event-driven Web Operating System.**

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![AWS Serverless](https://img.shields.io/badge/AWS-Lambda%20%7C%20API%20Gateway%20%7C%20DynamoDB-orange?logo=amazon-aws)
![Redis](https://img.shields.io/badge/Redis-Upstash%20Serverless-red?logo=redis)
![WebSockets](https://img.shields.io/badge/RealTime-Pusher%20WebSockets-purple?logo=pusher)

## 📖 Overview

Traditional static portfolios often fail to demonstrate a backend developer's architectural thinking and system design capabilities. **Joey OS** was built to solve this. It is a highly interactive Web OS that serves as my resume, technical blog, and a playground for demonstrating cloud-native engineering.

## 🏗️ Architecture & Tech Stack

This project adopts a **Serverless & Event-Driven Architecture** to ensure high availability, zero maintenance, and strict cost control.

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS, TypeScript.
- **Window Engine:** `react-rnd` for drag-and-drop and resize management.
- **Backend (Serverless):** AWS API Gateway, AWS Lambda (Python), AWS DynamoDB.
- **Real-Time Comm:** Pusher (WebSockets), Telegram Bot API.
- **AI & Security:** DeepSeek LLM API, Upstash Serverless Redis.
- **DevOps:** AWS Amplify.


## 🔥 Engineering Highlights (The "Hardcore" Details)

- **Zero-Dependency Deployment:** A common pitfall in Serverless development is bloated deployment packages. The backend of Joey OS is a monolithic Python Lambda that strictly utilizes the native `urllib.request` module. By shedding third-party dependencies (e.g., `requests` or official SDKs), it completely eliminates the need for `.zip` uploads or Lambda Layers. Anyone can fork this repo and paste the backend code directly into the AWS Lambda inline editor.
- **Hand-Rolled WebSocket HMAC Signatures:** Rather than utilizing the bulky official Pusher SDK, the WebSocket authentication and broadcasting logic were engineered from scratch. By manually assembling the HTTP request and generating SHA256 signatures using Python's native `hashlib` and `hmac`, the system maintains an extremely small runtime footprint while proving a profound grasp of cryptographic authentication protocols and RESTful standards.
- **VPC-Less Serverless Architecture:** Implementing rate-limiting usually dictates the use of Redis. However, deploying AWS ElastiCache necessitates complex VPC configurations, which inadvertently introduce Lambda "cold-start" latency and continuous billing. Joey OS circumvents this by adopting **Upstash Serverless Redis**, communicating entirely via REST APIs over the public internet. This delivers the high-concurrency benefits of Redis without the VPC overhead.


## 🧠 Key Technical Challenges & Solutions

### 1. Responsive UI via Virtual Canvas Scaling
- **Problem:** Based on absolute pixel positioning, windows would severely overlap on smaller screens (13-inch) or leave excessive whitespace on larger monitors (Mac Pro). Using standard CSS media queries to forcefully compress windows would break the aspect ratio and internal layouts.
- **Solution:** I treated the entire desktop as a "Virtual Canvas" with an ideal base resolution (1800x920). The system listens to `resize` events, dynamically calculates the scale ratio (`Math.min(scaleX, scaleY, 1)`), and applies a `transform: scale()` to the parent container. Crucially, this calculated scale value is passed down to the `react-rnd` drag engine to provide underlying coordinate compensation, ensuring accurate mouse tracking across all resolutions.

### 2. Mobile Touch Event Clash
- **Problem:** During mobile testing, the Minimize/Close buttons occasionally failed. The visual active state triggered, but the business logic did not execute.
- **Solution:** Analysis revealed that the 300ms click delay on mobile browsers, combined with the drag library intercepting `touchstart` events (`preventDefault`), swallowed the click events. I introduced an event exemption zone by adding a `cancel-drag` class to interactive buttons. Furthermore, I replaced the traditional `onClick` with a mobile-specific `onTouchEnd` binding, achieving zero-delay, precise touch responses.

### 3. Bypassing Cross-Origin iframe Restrictions
- **Problem:** Embedding my real GitHub and LinkedIn profiles directly via `iframe` was blocked by top-tier sites' anti-clickjacking security policies (`X-Frame-Options: DENY`).
- **Solution:** I adopted an "API Extraction + Frontend Redraw" strategy.
  - **GitHub:** Polled the public GitHub REST API to fetch repositories dynamically and integrated `github-readme-stats` SVG visualizations to rebuild a functional, hacker-style terminal UI.
  - **LinkedIn:** Used CSS animations (scanning laser lines) and React to render a highly simulated Digital ID Card, providing secure external links while maintaining the desktop's immersive experience.


## 🔒 Security, Privacy & Open Source Adaptability

Exposing direct-to-mobile WebSockets and LLM APIs to the public internet introduces critical security vectors, including DDOS attacks and token exhaustion.

- **IP-Based Rate Limiting via Redis:** To mitigate abuse, I implemented a sliding-window rate limiter using Upstash Serverless Redis at the API Gateway level. Client IP addresses are extracted; any requests exceeding the threshold (e.g., >15 requests/hour) immediately receive a `429 Too Many Requests` response, safeguarding the backend architecture.
- **Secrets Management & Adaptability:** Joey OS was designed to be easily forkable. Strict adherence to privacy means **zero hardcoded secrets** exist in the codebase. All sensitive endpoints and keys are injected at runtime via `.env.local` for local development and through AWS Amplify's Environment Variables panel for production.


## 🚀 How to Fork & Run Locally

I built Joey OS with open-source adaptability in mind. You can easily fork this repository and configure it with your own AWS backend and API keys.

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/joey-os.git](https://github.com/YOUR_USERNAME/joey-os.git)
cd joey-os
npm install
```

### 2. Environment Variables Setup

To ensure strict privacy and security, **never commit your secrets**. Create a `.env.local` file in the root directory:

```env
# .env.local

# [REQUIRED] Your AWS API Gateway Endpoint
NEXT_PUBLIC_AWS_API_URL=[https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/webhook](https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/webhook)

# [REQUIRED] Pusher WebSockets Credentials (for Live Chat)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# [OPTIONAL] Environment Isolation (local | stage | production)
# Changes the desktop background color dynamically to prevent staging confusion.
NEXT_PUBLIC_APP_ENV=local 

```

### 3. Deploying the Backend (AWS Lambda)

1. Navigate to the `aws-backend/` directory in this repository and copy the contents of `lambda_function.py`.
2. Go to your AWS Console, create a new Lambda function (Python 3.12+), and paste the code directly into the inline editor. No `.zip` packaging is required!
3. Expose the Lambda via **AWS API Gateway** (ensure CORS is enabled).
4. Configure the following **Environment Variables** in your AWS Lambda:
* `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`
* `LLM_API_KEY`
* `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
* `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`


5. Set up a **Telegram Webhook** pointing to your API Gateway URL.

### 4. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view your OS.

---

*Architected & Engineered by [Joey (Yepeng) Zhu*](https://yepengzhu.com)

