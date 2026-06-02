// data/projects.ts — projects as CASE STUDIES (the spine of the portfolio).
// Add more entries here; /work and /work/[slug] render from this.

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role?: string;
  summary: string; // short, for cards
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
    slug: "joey-os",
    title: "Joey OS",
    tagline: "A portfolio that is itself a live, full-stack serverless system.",
    year: "2025 — 2026",
    role: "Solo — design, frontend, backend, infra",
    summary:
      "This site. Instead of claiming I can build systems, the site IS one: real-time chat to my phone, an AI that answers questions about me, and live telemetry — all on serverless AWS.",
    problem:
      "A static CV can't show what a backend engineer actually does. I wanted the portfolio itself to be the proof — a running, full-stack, serverless product, not a page of bullet points.",
    approach: [
      "Single Next.js front end on AWS Amplify, talking to one Python Lambda that routes by request shape.",
      "Real-time live chat: visitor messages relay to my phone via the Telegram Bot API, and my replies push back to the browser over Pusher WebSockets.",
      "An AI assistant grounded in a hand-written knowledge base with explicit anti-hallucination rules; unanswered questions are logged so the knowledge base can grow.",
      "Abuse protection via Upstash serverless Redis (per-IP rate limiting) — no VPC, no ElastiCache cold-starts.",
    ],
    architecture: [
      "Browser → API Gateway → one Lambda → fans out to: DynamoDB (chat logs), DeepSeek (LLM), Telegram Bot API, Pusher (realtime), Upstash Redis (rate limit).",
      "Zero-dependency Lambda: native urllib only, so it pastes into the inline editor with no layers or zip uploads.",
      "Hand-rolled HMAC request signing to call Pusher without the SDK.",
    ],
    impact: [
      "A live system serving real visitors — not a mockup.",
      "Visitors get grounded, on-brand answers about my background on demand.",
      "Messages reach my phone in seconds and reply in the browser in real time.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "AWS Lambda",
      "DynamoDB",
      "API Gateway",
      "Pusher",
      "Telegram Bot API",
      "DeepSeek LLM",
      "Upstash Redis",
      "AWS Amplify",
    ],
    links: [
      { label: "Play the original Joey OS", href: "/joey-os" },
      { label: "Source", href: "https://github.com/zyyppp1/Joey-OS" },
    ],
    featured: true,
  },
  {
    slug: "visa-appointment-bot",
    title: "Visa Appointment Bot",
    tagline: "Selenium automation that snipes scarce visa interview slots.",
    year: "2024",
    role: "Solo",
    summary:
      "US / French visa interview slots sell out in seconds. I built a bot that watched the portal and alerted the instant one opened — and turned it into a small service.",
    problem:
      "Students refresh the visa portal for weeks because slots are released unpredictably and vanish instantly. Manual checking doesn't work.",
    approach: [
      "Python + Selenium to log in, poll availability on a schedule, and fire an alert the second a slot opened.",
      "Handled real-world friction: session/login expiry, the portal's own rate limits, and flaky DOM states.",
      "Productised it from a personal tool into a service for other students.",
    ],
    impact: [
      "Served real users and secured multiple interview slots.",
      "Earned £2000+ in two weeks.",
      "Sharpened browser automation and real-world edge-case handling.",
    ],
    stack: ["Python", "Selenium", "Automation"],
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
