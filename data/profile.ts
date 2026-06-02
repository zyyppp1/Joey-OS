// data/profile.ts — single source of truth for identity, links, SEO.

export const profile = {
  name: "Joey (Yepeng) Zhu",
  shortName: "Joey Zhu",
  title: "Backend / Cloud Engineer",
  tagline: "building reliable systems on AWS",
  summary:
    "Backend & cloud engineer based in the UK. I build secure, high-performance APIs and serverless systems with Node.js, Go, Python, and AWS.",
  bio: "I'm a backend and cloud engineer based in the UK, focused on building APIs and serverless systems that stay simple where it counts and solid under load. I'm AWS Solutions Architect – Associate certified, and most things I build — including this site — end up running on AWS.",
  location: "United Kingdom",

  // TODO: set your real production domain (used for SEO / OpenGraph / sitemap).
  siteUrl: "https://joeyzhu.dev",

  links: {
    github: "https://github.com/zyyppp1",
    linkedin: "https://www.linkedin.com/in/yepeng-zhu-9b0021314",
    // TODO: add a public contact email here if you want one shown on the site.
    email: "",
  },

  resumePdf: "/Joey_Resume.pdf",
  githubUsername: "zyyppp1",
} as const;
