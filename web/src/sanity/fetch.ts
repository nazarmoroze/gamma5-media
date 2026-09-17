import type { QueryParams } from "next-sanity";

import { client } from "./client";

// Published content, cached and refreshed at most once a minute.
export function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags = ["case"],
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
}) {
  return client.fetch(query, params, { next: { revalidate: 60, tags } });
}
