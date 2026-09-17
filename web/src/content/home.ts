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
  eyebrow: "Creative & full-cycle video production",
  title: "Video with a story",
  subtitle: "that makes your brand easier to remember.",
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

export type WorkCategory = "commercial" | "youtube" | "short";

export type WorkItem = {
  id: string;
  title: string;
  client: string;
  category: WorkCategory;
  poster: string;
  posterAlt: string;
  posterPosition?: string;
  video?: string;
  vertical?: boolean;
};

export const categoryLabels: Record<WorkCategory, string> = {
  commercial: "Commercial",
  youtube: "YouTube",
  short: "Short content",
};

// Items in brackets are placeholders until the real projects are added.
export const work: WorkItem[] = [
  {
    id: "real-estate-launch",
    title: "Real Estate Launch",
    client: "Belle Air",
    category: "commercial",
    poster: "/media/house.jpg",
    posterAlt: "Aerial view of a modern villa among pine trees",
    video: `${FRAMER}/aYC27sDEvHPjQu6vaEKNfMsHVE.mp4`,
  },
  {
    id: "land-of-tomorrow",
    title: "Land of Tomorrow",
    client: "bbf:",
    category: "commercial",
    poster: "/media/cigar.jpg",
    posterAlt: "Man with a cigar at golden hour",
    posterPosition: "45% 35%",
    video: `${FRAMER}/LikXAHb0WxHqnAT7rOwrbqrL2E.mp4`,
  },
  {
    id: "blockbuster-promo",
    title: "Blockbuster Promo",
    client: "Leptos",
    category: "commercial",
    poster: "/media/woman.jpg",
    posterAlt: "Close-up of a woman in soft light",
    posterPosition: "50% 35%",
    video: `${FRAMER}/U7GxP33neNpOrNSQe85zoD5Uu4.mp4`,
  },
  {
    id: "eden-bay",
    title: "Eden Bay",
    client: "bbf:",
    category: "short",
    poster: "/media/edenbay.jpg",
    posterAlt: "Waves breaking against a sea rock",
    video: `${FRAMER}/QRbIa1hIbtCCvo1f7NpqA9mFjOs.mp4`,
  },
  {
    id: "youtube-project-1",
    title: "[YouTube project]",
    client: "[Client]",
    category: "youtube",
    poster: "/media/videographer.jpg",
    posterAlt: "Camera operator filming on location",
    posterPosition: "55% 45%",
  },
  {
    id: "reel-1",
    title: "[Reel title]",
    client: "[Client]",
    category: "short",
    poster: "/media/horse.jpg",
    posterAlt: "Rider with a horse, vertical frame",
    posterPosition: "50% 35%",
    vertical: true,
  },
  {
    id: "youtube-project-2",
    title: "[YouTube project]",
    client: "[Client]",
    category: "youtube",
    poster: "/media/studio.jpg",
    posterAlt: "Film set with a green screen and camera rig",
  },
];
