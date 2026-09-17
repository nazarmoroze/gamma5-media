// Static Home content. Moves to Sanity in a later step.

const FRAMER = "https://framerusercontent.com/assets";

export const contacts = {
  email: "gamma5media@gmail.com",
  telegram: { handle: "@tillmannv", href: "https://t.me/tillmannv" },
  whatsapp: { label: "+357 96 167457", href: "https://wa.me/35796167457" },
  instagram: { handle: "gamma5media", href: "https://www.instagram.com/gamma5media/" },
  linkedin: { label: "GAMMA5 Media", href: "https://www.linkedin.com/company/gamma5-media" },
} as const;

export const site = {
  name: "GAMMA5",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://gamma5media.com").replace(/\/$/, ""),
  title: "Video Production Company in Cyprus",
  description:
    "GAMMA5 is a full-cycle video production company in Cyprus: commercials, corporate and real estate videos, YouTube and Reels, from idea to publishing.",
} as const;

export const services = [
  "Commercials & advertising",
  "Corporate video",
  "Real estate video",
  "YouTube production",
  "Reels & TikTok content",
  "Documentaries",
] as const;

export const hero = {
  title: "Video production that brings you clients",
  subtitle: "Commercials, real estate and social video for brands in Cyprus and worldwide.",
  cta: "Discuss your project",
  showreel: {
    src: `${FRAMER}/kIhVsOiVYF9wwVUSN7fY1OFEkHA.mp4`,
    poster: "/media/house.jpg",
  },
} as const;

export const about = {
  heading: "is a full‑cycle video production company based in Cyprus.",
  lead: "We plan, shoot and edit commercials, corporate films, real estate videos and social content for brands, agencies and property developers — from the first idea to final publishing.",
  body: "Our work is built on storytelling that creates emotion, builds trust and makes a brand easier to remember. We work with clients across Cyprus and all over the world.",
  stats: [
    { value: "18+", label: "Years of experience" },
    { value: "100+", label: "Completed projects" },
  ],
  clientsAlt: "Trinity, Lavita Invest, Leptos Estates, Art Sqr, bbf:, United Rescue Cyprus, ZIKZAK",
} as const;

export const portfolio = {
  title: "Selected video projects",
  intro: "Commercials, real estate films, YouTube and short-form content we’ve produced for brands and developers.",
} as const;

export const contact = {
  title: "Tell us about your video project",
  lede: "Get a quote for a commercial, corporate or real estate video. Share your goal and timeline, and we’ll come back with ideas and next steps.",
} as const;
