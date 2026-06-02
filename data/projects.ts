// data/projects.ts — projects as CASE STUDIES (the spine of the portfolio).
// Public-GitHub entries were generated from each repo's README; private projects
// (AI Resume Editor, Zoho Mail AI) are hand-written from their local READMEs.
// Add/curate entries here; /work and /work/[slug] render from this.

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role?: string;
  summary: string;
  problem: string;
  approach: string[];
  architecture?: string[];
  impact: string[];
  stack: string[];
  links?: { label: string; href: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    "slug": "joey-os",
    "title": "Joey OS",
    "tagline": "A portfolio that is itself a live, full-stack serverless system.",
    "year": "2025 — 2026",
    "role": "Solo — design, frontend, backend, infra",
    "summary": "This site. Instead of claiming I can build systems, the site IS one: real-time chat to my phone, an AI that answers questions about me, and live telemetry — all on serverless AWS.",
    "problem": "A static CV can't show what a backend engineer actually does. I wanted the portfolio itself to be the proof — a running, full-stack, serverless product, not a page of bullet points.",
    "approach": [
      "Single Next.js front end on AWS Amplify, talking to one Python Lambda that routes by request shape.",
      "Real-time live chat: visitor messages relay to my phone via the Telegram Bot API, and my replies push back to the browser over Pusher WebSockets.",
      "An AI assistant grounded in a hand-written knowledge base with explicit anti-hallucination rules; unanswered questions are logged so the knowledge base can grow.",
      "Abuse protection via Upstash serverless Redis (per-IP rate limiting) — no VPC, no ElastiCache cold-starts."
    ],
    "architecture": [
      "Browser → API Gateway → one Lambda → fans out to: DynamoDB (chat logs), DeepSeek (LLM), Telegram Bot API, Pusher (realtime), Upstash Redis (rate limit).",
      "Zero-dependency Lambda: native urllib only, so it pastes into the inline editor with no layers or zip uploads.",
      "Hand-rolled HMAC request signing to call Pusher without the SDK."
    ],
    "impact": [
      "A live system serving real visitors — not a mockup.",
      "Visitors get grounded, on-brand answers about my background on demand.",
      "Messages reach my phone in seconds and reply in the browser in real time."
    ],
    "stack": [
      "Next.js",
      "TypeScript",
      "AWS Lambda",
      "DynamoDB",
      "API Gateway",
      "Pusher",
      "Telegram Bot API",
      "DeepSeek LLM",
      "Upstash Redis",
      "AWS Amplify"
    ],
    "links": [
      {
        "label": "Play the original Joey OS",
        "href": "/joey-os"
      },
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/Joey-OS"
      }
    ],
    "featured": true
  },
  {
    "slug": "ai-resume-editor",
    "title": "AI Resume Editor",
    "tagline": "Paste a job description; a multi-agent pipeline tailors your résumé into an ATS-friendly one-page PDF — live.",
    "year": "2026",
    "role": "Solo — full-stack + AI",
    "summary": "An AI résumé-tailoring tool: paste a job description and a multi-agent LLM pipeline selects your most relevant experience, rewrites it into ATS-friendly bullets, compiles a one-page LaTeX PDF previewed live in the browser, writes a matching cover letter, and scores ATS keyword coverage.",
    "problem": "Tailoring a résumé to each job is slow and inconsistent, and generic résumés score poorly against ATS keyword filters.",
    "approach": [
      "Five-agent pipeline orchestrated server-side: JD analyzer → profile RAG (ChromaDB top-K facts) → résumé tailor (LaTeX body) → cover letter → compile + ATS quality check, with later stages run concurrently.",
      "Streams progress to the browser over Server-Sent Events; the final event carries the compiled PDF (HMAC-signed, expiring), the TeX source, an ATS score, and the cover letter.",
      "Provider-agnostic LLM layer — Anthropic, any OpenAI-compatible API (OpenAI / DeepSeek / Groq), or a local Ollama model — switchable by config with no code change.",
      "Per-JD retrieval from a ChromaDB profile store so only the most relevant experience is used."
    ],
    "architecture": [
      "Python backend: agents pipeline, ChromaDB RAG, a sandboxed xelatex compiler, a LangChain provider abstraction, and SQLite persistence.",
      "Vanilla-JS front end renders the PDF with PDF.js; the whole pipeline runs inline inside one streaming HTTP request (no job queue).",
      "Deployed on Fly.io (Singapore region)."
    ],
    "impact": [],
    "stack": [
      "Python",
      "LangChain",
      "ChromaDB (RAG)",
      "Server-Sent Events",
      "LaTeX (xelatex)",
      "PDF.js",
      "SQLite",
      "Fly.io"
    ],
    "links": [
      {
        "label": "Live app ↗",
        "href": "https://ai-resume-editor.fly.dev"
      }
    ],
    "featured": true
  },
  {
    "slug": "oxo-game-api",
    "title": "OXO Game API",
    "tagline": "A layered Go + Gin backend for game management: players, rooms, challenges, payments, and logs.",
    "year": "2025",
    "role": "Backend engineer",
    "summary": "A RESTful game management API built in Go (Gin + GORM + PostgreSQL) covering player management, room reservations, endless challenges, payment processing, and game-log collection. Ships with Docker Compose deployment, a clean layered architecture, and Postman test collections across five modules.",
    "problem": "Game operations need a single backend to manage players and levels, room bookings, an endless-challenge/prize-pool system, payment handling, and structured game-event logging — exposed through a consistent, well-documented REST API.",
    "approach": [
      "Exposes a versioned REST API (/api/v1) with five modules: player/level management, room and reservation management, endless challenges with a prize pool, game-log collection, and payment processing",
      "Organized in a clean layered architecture — API handlers, a business-logic service layer, and GORM data models — with logging and CORS middleware and centralized routing",
      "Persists data in PostgreSQL via GORM, including a JSONB game-log type, with an init.sql that creates tables, indexes, seed levels/players/rooms, and an initialized prize pool",
      "One-command Docker Compose deployment (Go API + PostgreSQL with health checks and persistent volume), plus a /health endpoint and Postman collections with per-module test reports"
    ],
    "architecture": [
      "Layered Go project: api/ (HTTP handlers) -> services/ (business logic, validation, transactions) -> models/ (GORM models) with config/, db/, middleware/, and routes/ packages",
      "Gin web framework with logging and CORS middleware and a centralized router registering all /api/v1 endpoints",
      "PostgreSQL (Alpine) accessed through GORM, including a custom JSONB type for game logs; schema and seed data provisioned by scripts/init.sql",
      "Containerized with a Dockerfile and docker-compose.yml orchestrating the API and Postgres (dependency health checks, persistent data volume, env-based config)",
      "Documentation-driven: per-module Markdown test reports in doc/ and a Postman test collection; roadmap notes for Redis caching, JWT auth, request rate limiting, WebSocket, and Prometheus monitoring"
    ],
    "impact": [],
    "stack": [
      "Go",
      "Gin",
      "GORM",
      "PostgreSQL",
      "Docker",
      "Docker Compose",
      "REST API",
      "Postman",
      "JSONB"
    ],
    "links": [
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/interview-YepengZhu-06.30"
      }
    ],
    "featured": true
  },
  {
    "slug": "tlscontact-visa-rpa-monitor",
    "title": "TLScontact Visa RPA Monitor",
    "tagline": "Full-link browser automation that hunts for French Schengen visa slots and auto-books them.",
    "year": "2026",
    "role": "Author",
    "summary": "A Tampermonkey userscript that automates the entire French Schengen visa appointment flow on the TLScontact portal — from login through calendar selection — with auto-booking, Telegram alerts, and a sleep-resistant background monitor.",
    "problem": "Booking a French Schengen visa appointment on the TLScontact portal requires constantly watching for scarce, fast-disappearing slots, which is impractical to do manually. The script automates the full booking process so available slots matching user preferences are detected and booked without manual intervention.",
    "approach": [
      "Full-link RPA: a tick-driven state machine navigates the entire flow (login through calendar) and auto-books slots when they match user preferences, retrying clicks on async SPA elements until they succeed",
      "Background 'insomnia' mode: a Web Worker heartbeat plus Web Audio API (AudioContext) initialization prevents OS/browser throttling when screens lock or tabs are backgrounded",
      "Robust DOM parsing via the TreeWalker API (NodeFilter.SHOW_TEXT) to extract slot text while filtering out scripts and non-content nodes, instead of fragile text extraction",
      "Telegram notifications with color-coded slot categories, configurable time/prime-slot preferences, persistent UI panel, and Cloudflare 'Error 1015' rate-limit detection with automatic halt"
    ],
    "architecture": [
      "Implemented as a Tampermonkey userscript (v5.8) running in Chrome/Edge on the JavaScript V8 engine",
      "Targets the TLScontact portal, a Next.js/React single-page application",
      "Uses Web Worker + postMessage(), Web Audio API/AudioContext, and TreeWalker for resilient background monitoring and parsing",
      "Integrates the Telegram Bot API (configured via @BotFather token and @userinfobot chat ID) for notifications; detects Cloudflare WAF rate limiting"
    ],
    "impact": [
      "Supports 7x24 'Background Insomnia Mode' with ~1-second precision monitoring",
      "State machine confirms consistency over 4 ticks (4 seconds) before acting",
      "Detects and halts on Cloudflare 'Error 1015' rate limiting to avoid IP bans"
    ],
    "stack": [
      "JavaScript",
      "Tampermonkey",
      "Web Worker",
      "Web Audio API",
      "TreeWalker API",
      "Telegram Bot API",
      "Next.js",
      "React",
      "Cloudflare WAF"
    ],
    "links": [
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/TLS-France-Visa-Slot-Searcher-Tampermonkey"
      }
    ],
    "featured": true
  },
  {
    "slug": "healthy-qa-chatbot",
    "title": "Healthy QA Chatbot",
    "tagline": "A Python medical Q&A chatbot exploring and comparing multiple ML and NLP modeling approaches.",
    "year": "2024",
    "role": "Author",
    "summary": "A Python-based medical question-answering chatbot designed to understand user health concerns and return professional, accurate responses. The project trains and compares a range of machine learning and deep learning models on a medical Q&A dataset to evaluate which approaches best support a healthcare assistant.",
    "problem": "Providing professional, accurate, and detailed answers to users' health-related questions is difficult, and the project investigates how a chatbot intelligent agent can understand user needs and assist in healthcare environments.",
    "approach": [
      "Built a medical Q&A chatbot in Python trained on a comprehensive dataset of medical questions and answers.",
      "Compared classical machine learning models — neural networks, random forests, support vector machines (SVM), and multilayer perceptrons (MLP).",
      "Explored advanced conversational approaches including Seq2Seq, transformer-based, retrieval-based, and reinforcement-learning-based models.",
      "Analyzed and synthesized model results to assess effectiveness for professional, accurate healthcare responses and future integration."
    ],
    "architecture": [
      "Python implementation (code in a py/ directory plus a packaged project archive).",
      "Multiple modeling strategies evaluated side by side: NN, random forest, SVM, MLP, Seq2Seq, transformer-based, retrieval-based, and RL-based models.",
      "Models trained on a medical question-and-answer dataset."
    ],
    "impact": [
      "The study concludes that chatbot development can effectively understand user needs and provide professional, accurate, and detailed responses, supporting the use of healthcare QA chatbots in medical environments."
    ],
    "stack": [
      "Python",
      "Neural Networks",
      "Random Forests",
      "SVM",
      "Multilayer Perceptron (MLP)",
      "Seq2Seq",
      "Transformers",
      "Reinforcement Learning",
      "NLP"
    ],
    "links": [
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/chatbot-project"
      }
    ],
    "featured": false
  },
  {
    "slug": "zoho-mail-ai",
    "title": "Zoho Mail AI Triage",
    "tagline": "A hybrid rule-engine + LLM that auto-classifies and routes a Zoho inbox.",
    "year": "2026",
    "role": "Solo",
    "summary": "An AI email assistant for Zoho Mail that classifies, routes, and organizes mail with a hybrid rule-engine + LLM pipeline — a deterministic rule engine resolves obvious cases instantly and only ambiguous mail reaches the LLM.",
    "problem": "Inbox triage is repetitive: most mail (rejections, OA invites, OTPs, newsletters) follows obvious patterns, yet running every email through an LLM is slow and expensive.",
    "approach": [
      "Hybrid pipeline: a deterministic rule engine handles obvious cases instantly; only ambiguous emails are sent to the LLM.",
      "Priority-ordered decision-tree prompt with 9 annotated few-shot examples for consistent edge-case classification (confirmations, rejections, OTP codes).",
      "First-match-wins routing into purpose-built Zoho folders — OTPs auto-deleted, uncertain mail flagged for manual review, nothing left stranded.",
      "OAuth2 with automatic token refresh on 401; first-run full backfill then incremental fetch via a known-ids optimization."
    ],
    "architecture": [
      "Multi-provider LLM behind one interface (DeepSeek, OpenAI, Groq, Claude, local Ollama), switchable with one line in .env.",
      "Rule engine + LLM classifier feed a deterministic routing table applied via the Zoho Mail API."
    ],
    "impact": [
      "Cuts LLM API cost ~60–70% by resolving obvious cases with the rule engine before involving the LLM."
    ],
    "stack": [
      "Python",
      "LLM (DeepSeek / OpenAI / Groq / Claude / Ollama)",
      "Zoho Mail API",
      "OAuth2"
    ],
    "featured": false
  },
  {
    "slug": "ui-and-api-test-automation-suite",
    "title": "QA Automation Suite",
    "tagline": "End-to-end test automation across browser UI, REST API, and manual test cases.",
    "year": "2025",
    "role": "QA automation (technical assessment)",
    "summary": "A software QA automation assessment that combines Playwright-driven UI tests against BBC Sport, Python API tests against a live exchange-rate service, and a set of documented manual test cases. Demonstrates a layered testing approach spanning automated and manual coverage.",
    "problem": "Built as the Adserve technical assessment for a Graduate Software Automation Test Engineer role, the project demonstrates the ability to design and implement automated UI and API tests alongside structured manual test cases.",
    "approach": [
      "UI tests automated with Playwright (sync API) against BBC Sport, covering finding today's matches, searching sports news end-to-end, and verifying the show-scores button",
      "API tests written in plain Python with the requests library, validating status code, response time, presence of expected data keys, and a set of expected currencies from a live exchange-rate API",
      "A folder of nine documented manual test cases complementing the automated coverage",
      "Tests use direct assertions and print-based pass/fail reporting via main() entry points"
    ],
    "architecture": [
      "Repository organized into three areas: 'UI test', 'API test', and 'Manual test cases'",
      "UI layer uses Playwright sync API launching a browser and asserting on rendered DOM elements via CSS selectors",
      "API layer uses the requests library and Python assert statements (no pytest) against the ExchangeRate-API endpoint",
      "Python-only project (100% Python)"
    ],
    "impact": [],
    "stack": [
      "Python",
      "Playwright",
      "requests",
      "REST API testing",
      "BBC Sport (test target)",
      "ExchangeRate-API (test target)"
    ],
    "links": [
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/UI-test-and-API-test"
      }
    ],
    "featured": false
  },
  {
    "slug": "us-visa-appointment-rescheduler",
    "title": "US Visa Appointment Rescheduler",
    "tagline": "Automatically hunts for earlier US visa appointment slots.",
    "year": "2024",
    "role": "Adapted & extended",
    "summary": "A Python automation tool that drives Google Chrome to repeatedly check the US visa scheduling site (ais.usvisa-info.com) for earlier appointment slots and notifies the user when one becomes available. Adapted for Colombian applicants.",
    "problem": "US visa appointment slots are scarce and the official scheduling portal does not alert applicants when an earlier date opens up, forcing people to manually refresh the site. This tool automates the search for an earlier slot for users who already have an appointment booked.",
    "approach": [
      "Drives a real Google Chrome browser to log in and poll the US visa scheduling portal (ais.usvisa-info.com) for available appointment dates",
      "Sends notifications via Pushover and/or Sendgrid when an earlier slot is found",
      "Configuration is supplied through a config.ini file; the script is run with a single command (python3 visa.py)",
      "Adapted specifically for the Colombian US visa scheduling flow"
    ],
    "architecture": [
      "Python 3 script (visa.py) that automates Chrome to interact with the visa portal",
      "Dependencies installed via requirements.txt; settings driven by a config.ini file",
      "Notification integrations with the Pushover and Sendgrid APIs"
    ],
    "impact": [],
    "stack": [
      "Python 3",
      "Google Chrome (browser automation)",
      "Pushover API",
      "Sendgrid API"
    ],
    "links": [
      {
        "label": "Source",
        "href": "https://github.com/zyyppp1/Find-U.S-Visa-slot"
      }
    ],
    "featured": false
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
