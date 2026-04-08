[English](README.md) | [简体中文](README_zh.md)

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

### 3. Live Chat — Mobile WebSocket Disconnect & Message Loss

- **Problem:** A subtle but critical bug was discovered during cross-device testing. When a visitor opened the site on **mobile Chrome**, switched to the Telegram app (to observe the incoming message), then came back to Chrome after a reply was sent — the reply never appeared. The exact same scenario worked perfectly on desktop (Mac Chrome).

  | Scenario | Result | Reason |
  |---|---|---|
  | Mac Chrome open → reply from phone Telegram | ✅ Works | Desktop browser stays active |
  | Mac Chrome open → reply from Mac Telegram | ✅ Works | Desktop browser stays active |
  | Mobile Chrome open → reply from Mac Telegram (no app switch) | ✅ Works | Browser stayed in foreground |
  | **Mobile Chrome open → switch to Telegram → reply** | ❌ Fails | **OS suspends background tab** |

- **Root Cause:** iOS and Android aggressively suspend background browser tabs the moment a user switches apps. This triggers the Page Visibility API (`visibilityState → 'hidden'`), and the OS cuts off background network activity within seconds — far faster than Pusher's own heartbeat timeout can detect. When Joey's reply was pushed via Pusher, the WebSocket channel had no active subscriber, and since **Pusher does not buffer undelivered events**, the message was permanently lost. React component state was intact, but the WebSocket connection was silently dead.

- **Solution:** A two-layer recovery mechanism was implemented:
  1. **Reconnect layer:** A `visibilitychange` event listener was added. When the page returns to the foreground (`'visible'`), the existing dead Pusher instance is immediately disconnected and a fresh WebSocket connection is re-established, re-subscribing to the session channel.
  2. **Message recovery layer:** Simultaneously, a new `get_live_messages` Lambda action queries DynamoDB for all stored messages under the current `session_id`. Since every message (visitor and Joey alike) is persisted to DynamoDB at send-time, this acts as a reliable offline buffer. The frontend merges returned messages against local state (deduplication by text), ensuring no message is ever lost regardless of how long the tab was backgrounded.

### 4. Bypassing Cross-Origin iframe Restrictions
- **Problem:** Embedding my real GitHub and LinkedIn profiles directly via `iframe` was blocked by top-tier sites' anti-clickjacking security policies (`X-Frame-Options: DENY`).
- **Solution:** I adopted an "API Extraction + Frontend Redraw" strategy.
  - **GitHub:** Polled the public GitHub REST API to fetch repositories dynamically and integrated `github-readme-stats` SVG visualizations to rebuild a functional, hacker-style terminal UI.
  - **LinkedIn:** Used CSS animations (scanning laser lines) and React to render a highly simulated Digital ID Card, providing secure external links while maintaining the desktop's immersive experience.


## 💬 Live Chat — Full Workflow

The Live Chat feature enables real-time, bidirectional messaging between a website visitor and Joey via Telegram, powered by a serverless event-driven pipeline.

```
Visitor (Browser)                    AWS Backend                  Joey (Telegram)
      |                                   |                              |
      |  1. Type & send message           |                              |
      |  POST { action: send_telegram,    |                              |
      |         session_id, message }     |                              |
      | --------------------------------> |                              |
      |                                   |  2. save_live_message()      |
      |                                   |     → DynamoDB (visitor msg) |
      |                                   |                              |
      |                                   |  3. send_to_telegram()       |
      |                                   |     "📩 New Web Message!     |
      |                                   |      Session: ABC123XY       |
      |                                   |      Visitor: Hello!"        |
      |                                   | ---------------------------> |
      |                                   |                              |  4. Joey reads
      |                                   |                              |     and replies
      |                                   |  5. Telegram webhook POST    |
      |                                   | <--------------------------- |
      |                                   |                              |
      |                                   |  6. handle_telegram_webhook()|
      |                                   |     Parse session_id from    |
      |                                   |     original message text    |
      |                                   |     save_live_message()      |
      |                                   |     → DynamoDB (joey msg)    |
      |                                   |                              |
      |                                   |  7. trigger_pusher()         |
      |                                   |     channel: session-ABC123XY|
      |                                   |     event: new_message       |
      |  8. Pusher WebSocket push         |                              |
      | <-------------------------------- |                              |
      |                                   |                              |
      |  9. channel.bind('new_message')   |                              |
      |     setMessages() → UI updates    |                              |
```

**Key design decisions:**

- **Session ID as the routing key:** Every visitor session gets a unique ID (generated on first load, stored as a module-level variable to survive window close/reopen without page refresh). This ID is embedded into the Telegram message text, so when Joey replies, Lambda can parse it and route the Pusher push to the exact browser tab.
- **DynamoDB as the persistent buffer:** Every message — visitor and Joey alike — is written to DynamoDB at the moment it is sent. This decouples delivery from persistence, enabling the mobile reconnection recovery described above.
- **Chat history persists across window close:** The messages array is stored in a module-level JavaScript variable (outside React component state). Closing and reopening the Live Chat window restores the full conversation; only a full page refresh resets it.

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

