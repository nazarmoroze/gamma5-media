// Static Home content. Moves to Sanity in a later step.

const FRAMER = "https://framerusercontent.com/assets";

export const contacts = {
  email: "gamma5media@gmail.com",
  telegram: { handle: "@tillmannv", href: "https://t.me/tillmannv" },
  whatsapp: { label: "+357 96 167457", href: "https://wa.me/35796167457" },
  instagram: { handle: "gamma5media", href: "https://www.instagram.com/gamma5media/" },
  linkedin: { label: "GAMMA5 Media", href: "https://www.linkedin.com/company/gamma5-media" },
} as const;

export const hero = {
  eyebrow: "Video production for brands, agencies & developers",
  title: "Video that brings you clients",
  subtitle: "Commercials, real estate films and social content — from strategy to final delivery. One team, full cycle, based in Cyprus.",
  cta: "Discuss your project",
  showreel: {
    src: `${FRAMER}/kIhVsOiVYF9wwVUSN7fY1OFEkHA.mp4`,
    poster: "/media/house.jpg",
  },
} as const;

export const about = {
  lead: "is a full-cycle video production team. We create commercials, real estate videos and creative content — from the first idea to final publishing.",
  body: "We help brands, agencies and developers get more customers and grow their business with video. Based in Cyprus, we work with clients all over the world.",
  stats: [
    { value: "18+", label: "Years of experience" },
    { value: "100+", label: "Completed projects" },
  ],
  clientsAlt: "Trinity, Lavita Invest, Leptos Estates, Art Sqr, bbf:, United Rescue Cyprus, ZIKZAK",
} as const;
