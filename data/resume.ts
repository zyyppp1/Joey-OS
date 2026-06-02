// data/resume.ts — résumé content as data (mirrors the data/blogs.ts pattern).

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  summary?: string;
  highlights: string[];
  stack?: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  note?: string;
};

export type Certification = {
  name: string;
  issuer?: string;
};

export const experience: ExperienceItem[] = [
  {
    company: "SpinnrTech",
    role: "Backend Engineer",
    period: "Jul 2025 — Present",
    summary:
      "B2B aggregated gaming platform — third-party API integration and transaction reliability.",
    highlights: [
      "Built secure, high-performance REST APIs and microservices in Node.js, Go, and Lua.",
      "Owned third-party vendor API integration and the security & stability of the transaction flow.",
      "Built a mock aggregation platform simulating third-party vendors, enabling independent API testing to isolate vendor vs. internal issues.",
      "Implemented logging, error handling, and monitoring across services.",
    ],
    stack: ["Go", "Node.js", "Lua", "PostgreSQL", "Redis", "Microservices"],
  },
  {
    company: "Everbridge",
    role: "QA Engineer / SDET",
    period: "Jul 2022 — Mar 2023",
    summary: "End-to-end quality for web and mobile releases in a Scrum team.",
    highlights: [
      "Automated 200+ test cases with Selenium, cutting manual testing time by ~35%.",
      "Tested frontend and mobile from a customer-facing perspective for end-to-end quality.",
      "Validated backend API response formats and data accuracy with Postman.",
    ],
    stack: ["Python", "Selenium", "JavaScript", "Postman"],
  },
];

export const education: EducationItem[] = [
  {
    school: "University of Nottingham",
    degree: "MSc, Computer Science",
    period: "2023 — 2024",
    note: "Merit.",
  },
  {
    school: "Beijing Union University",
    degree: "BEng, Software Engineering",
    period: "2019 — 2023",
    note: "GPA 83 (top 10%). Class president; published a paper on robot path planning.",
  },
];

export const certifications: Certification[] = [
  { name: "AWS Certified Solutions Architect – Associate" },
];

export const skills: string[] = [
  "JavaScript / Node.js",
  "Go",
  "Python",
  "Lua",
  "PostgreSQL",
  "Redis",
  "AWS (Lambda, DynamoDB, Serverless)",
  "Microservices",
  "REST APIs",
  "Selenium",
  "Git",
];
