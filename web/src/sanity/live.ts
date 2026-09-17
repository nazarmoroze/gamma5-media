import { defineLive } from "next-sanity/live";

import { client } from "./client";
import { token } from "./token";

// sanityFetch resolves the perspective and stega from Draft Mode automatically;
// <SanityLive /> refreshes cached data as soon as content is published.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || false,
  browserToken: token || false,
});
