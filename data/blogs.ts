// data/blogs.ts

export type BlogPost = {
  id: string;
  filename: string;
  title: string;
  date: string;
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    filename: 'python_visa_script.txt',
    title: 'How I earned £2000+ with a Python Selenium Script',
    date: '2024-05-12',
    content: `[ SYSTEM LOG: 2024-05-12 ]

When I was studying at the University of Nottingham, I noticed a huge demand for US visa interview slots. The official website was always fully booked, and students were struggling to find available dates.

As a developer, I saw an opportunity to automate this. 

I wrote a Python script using Selenium to log in, monitor the availability, and send an alert the second a slot opened up. 

What started as a tool for myself quickly became a service for others. Within two weeks, I helped multiple students secure their slots and earned over £2000. 

Key Takeaways:
1. Automation is powerful.
2. Finding real-world problems is the best way to practice coding.
3. Always respect rate limits (I learned this the hard way!).`
  },
  {
    id: '2',
    filename: 'golang_vs_node.txt',
    title: 'Migrating microservices from Node.js to Go',
    date: '2025-08-20',
    content: `[ SYSTEM LOG: 2025-08-20 ]

At SpinnrTech, we faced a bottleneck with our order tracking API written in Node.js. Under high concurrency, the event loop struggled with CPU-intensive data transformations.

I led the initiative to rewrite this specific microservice in Go.

Results:
- Memory footprint reduced by 60%.
- Response time dropped from 120ms to 15ms.
- Concurrency handled gracefully with Goroutines.

Node.js is still my go-to for I/O heavy, rapid prototyping, but Go's performance in CPU-bound microservices is unmatched.`
  },
  {
    id: '4',
    filename: 'livechat_mobile_debug.txt',
    title: 'Debugging a Silent WebSocket Failure — A Live Interview Story',
    date: '2026-04-13',
    content: `[ SYSTEM LOG: 2026-04-13 ]

# Debugging a Silent WebSocket Failure — A Live Interview Story

## 0. The Embarrassing Part

I was in an interview, showing my portfolio live on my phone. I opened the Live Chat, sent a message, switched to Telegram to demonstrate the real-time reply — and the reply never appeared.

Smiled through it. Fixed it the same evening.

## 1. The Feature

Joey OS has a Live Chat feature: visitors message me from the browser, I reply via Telegram on my phone, and the reply appears in real-time via Pusher WebSockets. The data flow:

  Visitor sends message
    → POST to AWS API Gateway → Lambda
    → save to DynamoDB + forward to Telegram

  Joey replies on Telegram
    → Telegram Webhook → Lambda
    → save to DynamoDB + trigger Pusher push
    → Pusher delivers to visitor browser via WebSocket

It worked perfectly. Until I tested it on mobile.

## 2. The Diagnosis — Test Matrix First, Code Later

My first instinct was to grep through the code looking for the bug. I stopped myself.

Instead, I isolated the one variable that mattered — platform — and ran four combinations:

  Mac Chrome open → reply from phone Telegram       ✅
  Mac Chrome open → reply from Mac Telegram         ✅
  Mobile Chrome open → reply from Mac (no switch)   ✅
  Mobile Chrome open → switch to Telegram → reply   ❌

One variable. One failure. The act of switching apps on mobile was the exact trigger.

## 3. The Root Cause — OS Level, Not Application Level

The bug was not in my code at all.

iOS and Android aggressively suspend background browser tabs the moment you switch to another app. This fires the Page Visibility API (visibilityState → 'hidden'), and the OS cuts background network activity within seconds — far faster than Pusher's own heartbeat timeout can detect.

By the time I replied on Telegram, the Pusher WebSocket had already been killed at the OS level. Lambda pushed the new_message event to the session channel — but there was no active subscriber. And since Pusher does not buffer undelivered events, the message was permanently lost.

The React component was intact. The state was intact. The connection was silently dead underneath.

## 4. The Fix — Two Layers

A single reconnection is not enough. Reconnecting re-establishes the WebSocket, but any messages pushed during the disconnected window are gone from Pusher forever. You need a second layer.

Layer 1 — Reconnection:
  Listen for the visibilitychange event.
  When the page returns to the foreground ('visible'),
  disconnect the dead Pusher instance and create a fresh one,
  re-subscribing to the session channel.

Layer 2 — Message Recovery:
  Simultaneously, query DynamoDB for all stored messages
  in the current session_id.
  Every message (visitor and Joey alike) is persisted to
  DynamoDB at the moment it is sent — before Pusher fires.
  This makes DynamoDB a reliable offline buffer.
  Merge returned messages against local state (deduplicate by text).
  No message is lost regardless of how long the tab was backgrounded.

The same Layer 2 also covers a related edge case: if a visitor closes the chat window entirely while I'm typing a reply, reopening the window calls fetchMissedMessages() on mount and recovers the full conversation.

## 5. The Lesson

The test matrix took ten minutes and pointed directly at the root cause before I touched a single line of investigation code.

When something "just doesn't work," the temptation is to dive straight into the code and start changing things. Resist it. Isolate the variable first. Systematic > intuitive, every time.

The bug lived at the OS level. No amount of reading React code would have found it.`
  },
  {
    id: '3',
    filename: 'joey_os_architecture_review.txt',
    title: 'Building a Serverless Web OS: An Architectural Review of Joey OS',
    date: '2026-03-07',
    content: `[ SYSTEM LOG: 2026-03-07 ]

# Building a Serverless Web OS: An Architectural Review of Joey OS

## 1. Background & Objectives
Traditional static portfolios often fail to demonstrate a developer's system design and full-stack engineering capabilities. Joey OS was built to address this by creating a highly interactive Web Desktop Operating System (Web OS) that serves as a resume, technical blog, and real-time communication platform.

Core objectives included:
- Multi-Window State Management: Implementing complex desktop-grade interactions (drag-and-drop, z-index layering, minimization).
- Full-Stack & Cloud-Native: Utilizing a decoupled frontend and Serverless backend for high availability and cost-efficiency.
- Real-Time & AI Integration: Incorporating full-duplex communication and Large Language Models (LLMs).
- Responsive Design: Ensuring a consistent and complete interactive experience across various desktop resolutions and mobile devices.

## 2. Technology Stack
- Frontend: Next.js (App Router), React 19, Tailwind CSS, TypeScript.
- Window Engine: react-rnd (for drag and resize management).
- Serverless Backend: AWS API Gateway, AWS Lambda (Python), AWS DynamoDB.
- Real-Time Communication: Pusher (WebSockets), Telegram Bot API.
- AI & Security: DeepSeek LLM API, Upstash Serverless Redis (Rate Limiting).
- DevOps: AWS Amplify.

## 3. Core Modules & System Design

### 3.1 Window Management & State Machine
The desktop application state is managed by a centralized Record<string, AppState> state machine in the frontend architecture. It tracks the open/minimized status of each application and utilizes an activeWindow mechanism to dynamically allocate z-index, mimicking native OS window layering.

### 3.2 Event-Driven Real-Time Communication (Live Chat)
To enable real-time interaction between visitors and the admin, the system bypasses traditional HTTP polling to prevent read/write amplification on the database under concurrent loads.
- Data Flow: Visitor sends message -> AWS API Gateway -> Lambda (saves to DynamoDB) -> Telegram API (pushes to Admin's mobile).
- Bidirectional Push: Admin replies via Telegram -> Webhook triggers API Gateway -> Lambda extracts Session ID and invokes Pusher API -> Pusher delivers the message to the visitor's browser in sub-seconds via WebSockets.

### 3.3 AI Agent Integration & API Security
DeepSeek API is integrated with a predefined System Prompt to build a context-aware resume assistant. To mitigate LLM API costs and prevent malicious abuse, Upstash Redis was introduced into the request pipeline to implement sliding-window rate limiting based on client IPs. Exceeding the threshold triggers a 429 status code at the API Gateway level.

### 3.4 System Observability
A real-time monitor dashboard was built to periodically fetch total requests (DynamoDB) and blocked threats (Redis). Combined with simulated frontend network latency (Ping) and rolling terminal logs, it provides a transparent view of the backend's health.

## 4. Key Technical Challenges & Solutions

### 4.1 Responsive UI via Virtual Canvas Scaling
- Problem: Absolute pixel positioning causes overlapping on smaller screens (13-inch) or excessive whitespace on larger monitors (Mac Pro). Media queries would break the aspect ratio.
- Solution: Treated the entire desktop as a "Virtual Canvas" with an ideal base resolution (1800x920). The system listens to resize events, dynamically calculates the scale ratio (Math.min(scaleX, scaleY, 1)), and applies a CSS transform: scale() to the parent container. Crucially, the calculated scale value is passed down to the react-rnd drag engine for underlying coordinate compensation, ensuring accurate mouse tracking across all resolutions.

### 4.2 Mobile Touch Event Clash
- Problem: Minimize/Close buttons occasionally failed on mobile devices. The visual active state triggered, but the business logic did not.
- Solution: The 300ms click delay on mobile browsers, combined with the drag library intercepting touchstart events (preventing default), swallowed the click events. We introduced an event exemption zone by adding a cancel-drag class to interactive buttons. Furthermore, we replaced the traditional onClick with a mobile-specific onTouchEnd binding, achieving zero-delay, precise touch responses.

### 4.3 Bypassing Cross-Origin iframe Restrictions (X-Frame-Options)
- Problem: Embedding real GitHub and LinkedIn profiles via iframe was blocked by top-tier sites' anti-clickjacking security policies (X-Frame-Options: DENY).
- Solution: Adopted an "API Extraction + Frontend Redraw" strategy.
  - GitHub: Polled the public GitHub REST API to fetch repositories dynamically and integrated github-readme-stats SVG visualizations to rebuild a functional terminal UI.
  - LinkedIn: Due to closed APIs, CSS animations (scanning laser lines) and React were used to render a highly simulated Digital ID Card, providing secure external links while maintaining the desktop's immersive experience.

## 5. Architectural Highlights (The "Hardcore" Details)

### 5.1 Zero-Dependency Deployment
A common pitfall in Serverless development is bloated deployment packages. The backend of Joey OS is a monolithic Python Lambda that strictly utilizes the native 'urllib.request' module. By shedding third-party dependencies (e.g., 'requests' or official SDKs), it completely eliminates the need for '.zip' uploads or Lambda Layers. This "copy-paste-ready" approach drastically lowers the barrier for open-source adoption and deployment.

### 5.2 Hand-Rolled HMAC Signatures
Rather than utilizing the bulky official Pusher SDK, the WebSocket authentication and broadcasting logic were engineered from scratch. By manually assembling the HTTP request and generating SHA256 signatures using Python's native 'hashlib' and 'hmac', the system maintains an extremely small runtime footprint while proving a profound grasp of cryptographic authentication protocols and RESTful standards.

### 5.3 VPC-Less Serverless Architecture
Implementing rate-limiting usually dictates the use of Redis. However, deploying AWS ElastiCache necessitates complex VPC configurations, which inadvertently introduce Lambda cold-start latency and continuous billing. Joey OS circumvents this by adopting Upstash Serverless Redis, communicating entirely via REST APIs over the public internet. This delivers the high-concurrency benefits of Redis without the VPC overhead.

## 6. CI/CD & Environment Isolation
The project leverages AWS Amplify for automated deployment. To clearly distinguish between Stage and Production environments without hardcoding CSS changes (which causes merge conflicts), the NEXT_PUBLIC_APP_ENV environment variable was introduced. By injecting different values for the main and stage branches in the Amplify console, Next.js dynamically switches background colors and titles at runtime, achieving elegant environment isolation with low maintenance cost.

## 7. Security, Privacy & Open Source Adaptability
Exposing direct-to-mobile WebSockets and LLM APIs to the public internet introduces critical security vectors, including DDOS attacks and token exhaustion.

- Rate Limiting via Redis: To mitigate abuse, I implemented a sliding-window rate limiter using Upstash Serverless Redis at the API Gateway level. Client IP addresses are tracked; any requests exceeding the threshold immediately receive a '429 Too Many Requests' response, safeguarding the backend architecture.
- Secrets Management & Adaptability: Joey OS was designed to be easily forkable by the developer community. Strict adherence to privacy means zero hardcoded secrets exist in the codebase. All sensitive endpoints (AWS API Gateway URLs, Pusher Keys) are injected at runtime via '.env.local' for local development and through AWS Amplify's Environment Variables panel for production. This ensures that anyone can clone the repository, plug in their own infrastructure values, and deploy their own Web OS securely without risking secret leakage.

## 8. Conclusion
Building Joey OS was not just about assembling modern frontend frameworks like Next.js and React. It was a comprehensive engineering challenge that touched upon Serverless architecture design, state management, security mitigation, and responsive optimization. By making careful architectural trade-offs (like the Virtual Canvas scaling and event-driven data flows), the system delivers a high-performance, interactive personal operating system with extremely low maintenance overhead.`
  }
];