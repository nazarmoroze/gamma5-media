import "server-only";

// Viewer token for drafts in Draft Mode / Presentation. Without it the site still
// renders published content; only previewing unpublished changes is unavailable.
export const token = process.env.SANITY_API_READ_TOKEN;
