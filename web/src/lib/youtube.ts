// Accepts the link formats people copy from YouTube: youtu.be/ID, /watch?v=ID, /embed/ID, /shorts/ID.
const PATTERNS = [
  /youtu\.be\/([A-Za-z0-9_-]{6,})/,
  /[?&]v=([A-Za-z0-9_-]{6,})/,
  /youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,})/,
];

export function youtubeId(url?: string | null) {
  if (!url) return null;
  for (const pattern of PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// youtube-nocookie.com does not set cookies until the film actually plays.
export const youtubeEmbedSrc = (id: string, autoplay = true) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${autoplay ? "&autoplay=1" : ""}`;

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
